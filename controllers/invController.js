const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function(req, res, next){
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name

    res.render("./inventory/classification",{
        title: `${className} vehicles`,
        nav,
        grid,
    })
}

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildInventoryDetailView = async function(req, res, next){
    const inventory_id = req.params.inventoryId
    const data = await invModel.getItemByInventoryId(inventory_id)
    const details = await utilities.buildItemDetails(data)
    let nav = await utilities.getNav()
    const title = `${data.inv_year} ${data.inv_make} ${data.inv_model}`

    res.render("./inventory/details",{
        title:title,
        nav,
        details
    })
}

module.exports = invCont