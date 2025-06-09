// Needed Resources 
const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

//Function to produce an error 
async function buildError(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    nav,
    loggedin: req.session.loggedin,
    card,
    })
}

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    loggedin: req.session.loggedin,
    errors: null
  })
}

/* ****************************************
*  To Logout of the account and redirect to home
* *************************************** */
async function buildLogout(req, res, next) {
  req.session.destroy((err) =>{
    if (err){
      console.log("Logout error:", err)
      return next(err)
    }
    res.clearCookie("jwt")
    res.redirect("/")
})
}

/* ****************************************
*  Deliver update view
* *************************************** */
async function buildUpdate(req, res, next){
    let nav = await utilities.getNav()
    const {account_id, account_firstname, account_lastname, account_email} = res.locals.accountData
    res.render("account/update", {
        title: "Update your Account",
        nav,
        loggedin: req.session.loggedin,
        account_id,
        account_firstname,
        account_lastname,
        account_email,
        errors: null
    })
}

/* ***************************
 *  Update Account Data
 * ************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id
  } = req.body

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult) {
    const accountData = await accountModel.getAccountById(account_id)
    const itemName = updateResult.account_firstname + " " + updateResult.account_lastname
    req.flash("notice", `${itemName}, your account was successfully updated.`)
    res.render("account/management",{
      title: "Management",
      nav,
      accountData,
      loggedin: true,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, your account update failed.")
    res.status(501).render("account/update", {
    title: "Update your Account",
    nav,
    loggedin: req.session.loggedin,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id
    })
  }
}

/* ***************************
 *  Update Password in the account
 * ************************** */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body
    
  // Hash the password before storing
  try {
    // regular password and cost (salt is generated automatically)
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const regResult = await accountModel.changePassword(hashedPassword, account_id)

    if (regResult){
      const accountData = await accountModel.getAccountById(account_id)

      req.flash("notice",`Congratulations, password updated successfully.`)
      res.render("account/management",{
      title: "Management",
      nav,
      accountData,
      loggedin: true,
      errors: null
    })
    } else{
      throw new Error("Password update failed")
    }
} catch (error){
  console.error("Error updating password:", error)
  req.flash("notice", "Sorry, there was an error processing the password update.")
  res.status(500).render("account/update", {
    title: "Update your account",
    nav,
    loggedin: req.session.loggedin,
    errors: null
  })
}}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        loggedin: req.session.loggedin,
        errors: null
    })
}

/* ****************************************
*  Deliver management view
* *************************************** */
async function buildManagement(req, res, next){
    let nav = await utilities.getNav()
    // const accountId = req.session.account_id
    // const accountData = await accountModel.getAccountById(accountId)
    res.render("account/management", {
        title: "Management",
        nav,
        accountData: res.locals.accountData,
        loggedin: res.locals.loggedin,
        errors: null
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const{ account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      loggedin: false,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult){
    req.flash(
      "notice",
      `Congratulations, you\'re registered. Please log in.`
    )
    res.render("account/login", {
      title: "Login",
      nav,
      loggedin: false,
    })
  } else{
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      loggedin: false,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      loggedin: req.session.loggedin,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      req.session.loggedin = true
      req.session.account = {
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_type: accountData.account_type,
      }

      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        loggedin: req.session.loggedin,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


module.exports = { buildLogin, buildRegister, registerAccount, buildError, accountLogin, buildManagement, buildLogout, buildUpdate, updateAccount, updatePassword }