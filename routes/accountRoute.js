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

// Route to build account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));


// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
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

module.exports = router;