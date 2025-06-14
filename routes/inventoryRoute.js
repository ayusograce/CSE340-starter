// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities") 
const regValidate = require('../utilities/inventory-validation')
const invCont = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build view page by inventory ID
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build management page
router.get("/", utilities.checkAccessToken, utilities.handleErrors(invController.buildManagement));

// Route to build add classification page
router.get("/add-classification", utilities.checkAccessToken, utilities.handleErrors(invController.buildAddClassification));

// Process the registration classification
router.post(
  "/add-classification",
  utilities.checkAccessToken,
  regValidate.classificationRules(),
  regValidate.checkClasData,
  utilities.handleErrors(invController.addClassification)
)

// Route to build inventory page
router.get("/add-inventory", utilities.checkAccessToken, utilities.handleErrors(invController.buildAddInventory));

// Process the add inventory
router.post(
  "/add-inventory",
  utilities.checkAccessToken,
  regValidate.inventoryRules(),
  regValidate.checkInvData,
  utilities.handleErrors(invController.addInventory)
)

// Get inventory by classification
router.get("/getInventory/:classification_id",  utilities.handleErrors(invController.getInventoryJSON))

// Route to build the edit/update page
router.get("/edit/:inv_id", utilities.checkAccessToken, utilities.handleErrors(invController.buildEditInventory));

// Route to process the updates in the edit page
router.post("/update/", utilities.checkAccessToken, regValidate.newInventoryRules(), regValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory));

// Route to build the delete page
router.get("/delete/:inv_id", utilities.checkAccessToken, utilities.handleErrors(invController.buildDeleteInventory));

// Route to process the delete
router.post("/delete/", utilities.checkAccessToken, utilities.handleErrors(invController.deleteInventory));

// Route to add new comment
router.post("/add-comment", regValidate.commentRules(), regValidate.checkcommentData, utilities.handleErrors(invCont.newComment));

module.exports = router;