const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const commentModel = require("../models/comment-model")

const invCont = {}

/* ***************************
 *  Build detail page by inventory Id WITH COMMENTS
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getProductByInventoryId(inv_id)
  const card = await utilities.buildProductCard(data)
  let nav = await utilities.getNav()

  // To show comments in the page
  const comments = await commentModel.getComments(inv_id)

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
    errors:null
  })
}

/* ***************************
 *  Add new comment in the page
 * ************************** */
invCont.newComment = async function (req, res, next) {
  const {comment_text, inv_id } = req.body
  // console.log("session data:", req.session);
  const account_id = req.session.account.account_id;
  if (!account_id){
    req.flash("notice", "You must be logged in to comment.");
    return res.redirect(`/inv/detail/${inv_id}`)
  }
  try {
    await commentModel.registerComment(comment_text, inv_id, account_id)
    res.redirect(`/inv/detail/${inv_id}`)
  } catch (err) {
    console.error(err)
    req.flash("notice", "Failed to add new comment.")
    res.redirect(`/inv/detail/${inv_id}`)
  }
}



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
    loggedin: req.session.loggedin,
    grid,
  })
}


/* ***************************
 *  Build management page
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    loggedin: req.session.loggedin,
    errors: null,
    classificationSelect,
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
    loggedin: req.session.loggedin,
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
      loggedin: req.session.loggedin,
    })
  } else{
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add classification",
      nav,
      loggedin: req.session.loggedin,
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
    loggedin: req.session.loggedin,
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
      loggedin: req.session.loggedin,
    })
  } else{
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      loggedin: req.session.loggedin,
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

/* ***************************
 *  Build edit inventory page
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getProductByInventoryId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    loggedin: req.session.loggedin,
    classification: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    loggedin: req.session.loggedin,
    classification: classificationSelect,
    errors: null,
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
    classification_id
    })
  }
}

/* ***************************
 *  Build delete confirmation page
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getProductByInventoryId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    loggedin: req.session.loggedin,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inv_id)
  const result = await invModel.deleteInventory(inv_id)

  if (!result) {
    req.flash("notice", `The item was successfully removed.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the deletion failed.")
    const itemData = await invModel.getProductByInventoryId(inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      loggedin: req.session.loggedin,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
      })
  }
}

  module.exports = invCont