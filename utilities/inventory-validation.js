const utilities = require("./index")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")
const commentModel = require("../models/comment-model")

/*  **********************************
*  New comments Validation Rules
* ********************************* */
validate.commentRules = () => {
return [
    // name is required and cannot contain a space or special character of any kind
    body("comment_text")
    .trim()
    .notEmpty()
    .withMessage("You have to write a comment."),
]
}

/* ******************************
 * Check data and return errors or continue add new comment
 * ***************************** */
validate.checkcommentData = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      const inv_id = req.body.inv_id
      const data = await invModel.getProductByInventoryId(inv_id)
      const card = await utilities.buildProductCard(data)
      let nav = await utilities.getNav()
      const comments = await commentModel.getComments(inv_id) // To show comments in the page
      const productYear = data.inv_year
      const productMake = data.inv_make
      const productModel = data.inv_model
      res.render("./inventory/detail", {
        title: productYear +" "+ productMake +" "+ productModel,
        nav,
        loggedin: req.session.loggedin,
        card,
        comments,
        data,
        errors,
    })
    return
  }
  next()
}


/*  **********************************
*  Registration Data Validation Rules
* ********************************* */
validate.classificationRules = () => {
return [
    // name is required and cannot contain a space or special character of any kind
    body("classification_name")
    .trim()
    .notEmpty()
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Name does not meet the requirements."),
]
}

/* ******************************
 * Check data and return errors or continue to registration of classification
 * ***************************** */
validate.checkClasData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}


/*  **********************************
*  Registration Data Validation Rules for INVENTORY
* ********************************* */
validate.inventoryRules = () => {
return [
    // make name 
    body("inv_make")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a make."),

    // model name 
    body("inv_model")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a model."),

    // year 
    body("inv_year")
    .trim()
    .escape()
    .isLength({ min:4, max:4 })
    .isNumeric()
    .withMessage("Please provide a valid year."),

    // description
    body("inv_description")
    .trim()
    .notEmpty()
    .withMessage("Please provide a description."),

    // image path 
    body("inv_image")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide an image path."),

    // image thumbnail 
    body("inv_thumbnail")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a thumbnail path."),

    // price
    body("inv_price")
    .isFloat({min:0})
    .withMessage("Please provide a positive number."),

    // miles
    body("inv_miles")
    .isInt({min:0})
    .withMessage("Please provide a positive number."),

    // color
    body("inv_color")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a color."),

    // classification 
    body("classification_id")
    .isInt()
    .withMessage("Please select a classification."),
]
}

/* ******************************
 * Check data and return errors or continue to registration of inventory
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
  const { 
    inv_make, inv_model, inv_year, inv_description, inv_image,
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id 
  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification: classificationList
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to update of inventory
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { 
    inv_id, inv_make, inv_model, inv_year, inv_description, inv_image,
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id 
  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification: classificationList
    })
    return
  }
  next()
}

/*  **********************************
*  Registration Data Validation Rules for INVENTORY
* ********************************* */
validate.newInventoryRules = () => {
return [
    // make name 
    body("inv_make")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a make."),

    // model name 
    body("inv_model")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a model."),

    // year 
    body("inv_year")
    .trim()
    .escape()
    .isLength({ min:4, max:4 })
    .isNumeric()
    .withMessage("Please provide a valid year."),

    // description
    body("inv_description")
    .trim()
    .notEmpty()
    .withMessage("Please provide a description."),

    // image path 
    body("inv_image")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide an image path."),

    // image thumbnail 
    body("inv_thumbnail")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a thumbnail path."),

    // price
    body("inv_price")
    .isFloat({min:0})
    .withMessage("Please provide a positive number."),

    // miles
    body("inv_miles")
    .isInt({min:0})
    .withMessage("Please provide a positive number."),

    // color
    body("inv_color")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a color."),

    // classification 
    body("classification_id")
    .isInt()
    .withMessage("Please select a classification."),
]
}


module.exports = validate
