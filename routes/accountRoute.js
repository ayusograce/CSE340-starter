// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities") 
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build an error
router.get("/servererror", utilities.handleErrors(accountController.buildError));

// Route to build account login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build account registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// // Process the login data
// router.post(
//   "/login",
//   regValidate.loginRules(),
//   regValidate.checkLogData,
//   utilities.handleErrors(accountController.loginAccount)
// )

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router;