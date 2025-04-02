const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*******************************
 * Registration Validation Rules
 ******************************/
validate.registrationRules = ()=>{
    return [
        //first name is required and must be string
        body("account_firstname")
            .trim()                 // remove leading and trailing whitespace
            .escape()               // replace special characters with HTML entities
            .notEmpty()             // something other than whitespace required
            .isLength({min:1})      // At least 1 character long
            .withMessage("Please provide a first name."),    //error message

        //last name is required and must be string
        body("account_lastname")
            .trim()                 // remove leading and trailing whitespace
            .escape()               // replace special characters with HTML entities
            .notEmpty()             // something other than whitespace required
            .isLength({min:1})      // At least 1 character long
            .withMessage("Please provide a last name."),    //error message

        //valid email is required and cannot already exist in database
        body("account_email")
            .trim()                 // remove leading and trailing whitespace
            .escape()               // replace special characters with HTML entities
            .notEmpty()             // something other than whitespace required
            .isEmail()              // valid email pattern
            .normalizeEmail()       // standardize email format
            .withMessage("A valid email is required."),    //error message

        //password is required and must meet requirements
        body("account_password")
            .trim()                 // remove leading and trailing whitespace
            .notEmpty()             // is requires
            .isStrongPassword({     // meets password requirements
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })
            .withMessage("Password does not meet requirements.")    //error message
    ]
}

/*******************************
 * Process Registration Data
 ******************************/
validate.checkRegData = async(req, res, next)=>{
    const {
        account_firstname,
        account_lastname,
        account_email
    } = req.body

    let errors = []

    errors = validationResult(req)

    if(!errors.isEmpty()){
        let nav = await utilities.getNav()

        res.render("account/register",{
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email
        })

        return
    }

    next()
}

module.exports = validate