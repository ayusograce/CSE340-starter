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
  // const classificationSelect = await utilities.buildClassificationList()
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

/* ****************************************
*  Process Add Classification
* *************************************** */
invCont.addClassification = async function(req, res, next) {
  const{ classification_name} = req.body
  const clasResult = await invModel.registerClassification(classification_name)
  let nav = await utilities.getNav()

  if (clasResult){
    req.flash(
      "notice",
      `Congratulations, you've registered the ${classification_name} classification`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
    })
  } else{
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add classification",
      nav,
    })
  }
}

/* ***************************
 *  Build add inventory page
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add new Inventory",
    nav,
    errors: null,
    classification: classificationList
  })
}

/* ****************************************
*  Process Add Inventory
* *************************************** */
invCont.addInventory = async function(req, res, next) {
  const{ inv_make, inv_model, inv_year, inv_description, inv_image,
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
  const invResult = await invModel.registerInventory({inv_make, inv_model, inv_year, inv_description, inv_image,
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id});
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList(classification_id);
  if (invResult){
    req.flash(
      "notice",
      `Congratulations, you've added the ${inv_make} ${inv_model} ${inv_year} correctly`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
    })
  } else{
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-inventory", {
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
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

  module.exports = invCont