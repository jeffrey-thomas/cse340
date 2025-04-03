const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

const validate = {}

/*******************************
 * Add Classification Validation Rules
 ******************************/
validate.addClassRules = ()=>{
    return [
        
        //classification_name is a string with no spaces or special characters
        body("classification_name")
            .trim()                 // remove leading and trailing whitespace
            .notEmpty()             // something other than whitespace required
            .isAlphanumeric()       // consists only of letters and digits
            .withMessage("Classification name does not meet requirements."),    //error message
    ]
}

/*******************************
 * Process Add Classification Data
 ******************************/
validate.checkAddClassData = async(req, res, next)=>{
    const {
        classification_name
    } = req.body

    let errors = []

    errors = validationResult(req)

    if(!errors.isEmpty()){
        let nav = await utilities.getNav()

        res.render("inventory/add-classification",{
            errors,
            title: "Add Classification",
            nav,
            classification_name
        })

        return
    }

    next()
}

/*******************************
 * Add Vehicle Validation Rules
 ******************************/
validate.addVehicleRules = ()=>{
    return [
        
        //make is required and must be string
        body("inv_make")
            .trim()                 // remove leading and trailing whitespace
            .escape()               // replace special characters with HTML entities
            .notEmpty()             // something other than whitespace required
            .isLength({min:1})      // At least 1 character long
            .withMessage("Please provide a vehicle make."),    //error message

        //model is required and must be string
        body("inv_model")
            .trim()                 // remove leading and trailing whitespace
            .escape()               // replace special characters with HTML entities
            .notEmpty()             // something other than whitespace required
            .isLength({min:1})      // At least 1 character long
            .withMessage("Please provide a vehicle model."),    //error message

        //classification is required and must be an integer
        body("classification_id")
            .isInt()                // must be integer
            .withMessage("Please choose a valid classification."),    //error message

        //year is required and must be four digits
        body("inv_year")
            .trim()                     // remove leading and trailing whitespace
            .escape()                   // replace special characters with HTML entities
            .notEmpty()                 // something other than whitespace required
            .isInt()                    // years are integers
            .isLength({min:4, max:4})   // must be exactly 4 characters long
            .withMessage("Please provide a valid year."),    //error message

        //description is required and must be string
        body("inv_description")
            .trim()                 // remove leading and trailing whitespace
            .notEmpty()             // something other than whitespace required
            .isLength({min:1})      // At least 1 character long
            .withMessage("Please provide a vehicle description."),    //error message

        //image is required and must be string
        body("inv_image")
            .trim()                 // remove leading and trailing whitespace
            .notEmpty()             // something other than whitespace required
            .isLength({min:1})      // At least 1 character long
            .withMessage("Please provide a valid path to an image."),    //error message

        //thumbnail is required and must be string
        body("inv_thumbnail")
            .trim()                 // remove leading and trailing whitespace
            .notEmpty()             // something other than whitespace required
            .isLength({min:1})      // At least 1 character long
            .withMessage("Please provide a valid path to a thumbnail image."),    //error message

        //price is required and must be an integer
        body("inv_price")
            .trim()                 // remove leading and trailing whitespace
            .escape()               // replace special characters with HTML entities
            .notEmpty()             // something other than whitespace required
            .isNumeric()            // must be number
            .isLength({max:9})      // db field is limited to 9 digits
            .withMessage("Please provide a valid price."),    //error message

        //miles is required and must be an integer
        body("inv_miles")
            .trim()                 // remove leading and trailing whitespace
            .escape()               // replace special characters with HTML entities
            .notEmpty()             // something other than whitespace required
            .isInt()                // must be integer
            .withMessage("Please provide a valid number of miles."),    //error message

        //color is required and must be string
        body("inv_color")
            .trim()                 // remove leading and trailing whitespace
            .escape()               // replace special characters with HTML entities
            .notEmpty()             // something other than whitespace required
            .isLength({min:1})      // At least 1 character long
            .withMessage("Please provide a vehicle color."),    //error message
    ]
}

/*******************************
 * Process Vehicle Data
 ******************************/
validate.checkVehicleData = async(req, res, next)=>{
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

    let errors = []

    errors = validationResult(req)

    if(!errors.isEmpty()){
        let nav = await utilities.getNav()
        let classificationMenu = await utilities.buildClassificationMenu(classification_id)
        res.render("inventory/add-vehicle",{
            errors,
            title: "Add Vehicle",
            nav,
            classificationMenu,
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
        })

        return
    }

    next()
}

/*******************************
 * Process Vehicle Data -> redirect to Edit View
 ******************************/
validate.checkUpdateData = async(req, res, next)=>{
    const {
        inv_id,
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

    let errors = []

    errors = validationResult(req)

    if(!errors.isEmpty()){
        let nav = await utilities.getNav()
        let classificationMenu = await utilities.buildClassificationMenu(classification_id)
        res.render("inventory/edit-vehicle",{
            errors,
            title: `Edit ${inv_make} ${inv_model}`,
            nav,
            classificationMenu,
            classification_id,
            inv_id,
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

        return
    }

    next()
}


module.exports = validate