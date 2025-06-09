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

// Route to build account logout view
router.get("/logout", utilities.handleErrors(accountController.buildLogout));

// Route to build account registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to build account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));


// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
)

// Route to build account update view
router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdate));

// Process the update request
router.post(
  "/update",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process the update request
router.post(
  "/password",
  regValidate.passwordRules(),
  regValidate.checkPassword,
  utilities.handleErrors(accountController.accountPassword)
)

module.exports = router;