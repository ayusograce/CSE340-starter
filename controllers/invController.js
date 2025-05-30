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



  module.exports = invCont