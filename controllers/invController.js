const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build detail page by inventory Id
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getProductByInventoryId(inv_id)
  const card = await utilities.buildProductCard(data)
  let nav = await utilities.getNav()
  const productYear = data.inv_year
  const productMake = data.inv_make
  const productModel = data.inv_model
  res.render("./inventory/detail", {
    title: productYear +" "+ productMake +" "+ productModel,
    nav,
    card,
  })
}


/* ***************************
 *  Build management page
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Management",
    nav,
  })
}

/* ***************************
 *  Build add classification page
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add new classification",
    nav,
    errors: null
  })
}

/* ***************************
 *  Build add vehicle page
 * ************************** */
invCont.buildAddVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-vehicle", {
    title: "Add new Vehicle",
    nav,
    errors: null
  })
}

  module.exports = invCont