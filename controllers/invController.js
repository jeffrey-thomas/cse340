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
    let className = await invModel.getClassificationName(classification_id)

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

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagementView = async function(req, res, next){
    let nav = await utilities.getNav()

    res.render("./inventory/management",{
        title:"Inventory Management",
        nav,
    })
}

/* ****************************************
*  Deliver Add Classification View
* *************************************** */
invCont.buildAddClass = async function(req, res, next){
    let nav = await utilities.getNav()
    res.render("inventory/add-classification",{
        title:"Add Classification",
        nav,
        errors:null
    }) 
}

/* ****************************************
*  Process Add Classification Action
* *************************************** */
invCont.addClassification = async function(req, res){
    const {
        classification_name
    } = req.body

    const dbResult = await invModel.addClassification(classification_name)

    if(dbResult){
        req.flash(
            "notice", 
            `Classification '${classification_name}' successfully created.`
        )
        let nav = await utilities.getNav()
        res.status(201).render("inventory/management",{
            title:"Inventory Management",
            nav,
        })
    } else {
        let nav = await utilities.getNav()
        req.flash("notice", "Sorry, the classification creation failed.")
        res.status(501).render("inventory/add-classification",{
            title:"Add Classification",
            nav,
            errors:null
        })
    }
}

/* ****************************************
*  Deliver Add Classification View
* *************************************** */
invCont.buildAddVehicle = async function(req, res, next){
    let nav = await utilities.getNav()
    let classificationMenu = await utilities.buildClassificationMenu()
    res.render("inventory/add-vehicle",{
        title:"Add Vehicle",
        nav,
        classificationMenu,
        errors:null
    }) 
}

/* ****************************************
*  Process Add Vehicle Action
* *************************************** */
invCont.addVehicle = async function(req, res){
    const {
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
    } = req.body

    const dbResult = await invModel.addVehicle(
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
    )

    if(dbResult){
        req.flash(
            "notice", 
            `${inv_year} ${inv_make} ${inv_model} successfully added to inventory.`
        )
        let nav = await utilities.getNav()
        res.status(201).render("inventory/management",{
            title:"Inventory Management",
            nav,
        })
    } else {
        let nav = await utilities.getNav()
        let classificationMenu = await utilities.buildClassificationMenu(classification_id)
        req.flash("notice", "Sorry, the vehicle creation failed.")
        res.status(501).render("inventory/add-vehicle",{
            title:"Add Vehicle",
            nav,
            classificationMenu,
            errors:null,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        })
    }
}

module.exports = invCont