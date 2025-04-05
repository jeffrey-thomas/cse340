const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

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
            .withMessage("A valid email is required.")    //error message
            .custom(async (account_email)=>{
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if(emailExists)
                    throw new Error("Email exists. Please log in or use a different email.")
            }),

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

/*******************************
 * Login Validation Rules
 ******************************/
validate.loginRules = ()=>{
    return [
        
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
 * Process Login Data
 ******************************/
validate.checkLoginData = async(req, res, next)=>{
    const {
        account_email
    } = req.body

    let errors = []

    errors = validationResult(req)

    if(!errors.isEmpty()){
        let nav = await utilities.getNav()

        res.render("account/login",{
            errors,
            title: "Login",
            nav,
            account_email
        })

        return
    }

    next()
}

/*******************************
 * Update Personal Info Validation Rules
 ******************************/
validate.updateInfoRules = ()=>{
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
            .withMessage("A valid email is required.")    //error message
            .custom(async (account_email, {req})=>{
                const emailUnavailable = await accountModel.checkEmailOwnedByOther(account_email, req.body.account_id)
                if(emailUnavailable)
                    throw new Error("Email in use by another account.")
            }),
    ]
}

/*******************************
 * Process Update Info Data
 ******************************/
validate.checkUpdateInfoData = async(req, res, next)=>{
    const {
        account_firstname,
        account_lastname,
        account_email
    } = req.body

    let errors = []

    errors = validationResult(req)

    if(!errors.isEmpty()){
        let nav = await utilities.getNav()

        res.render("account/update",{
            errors,
            title: "Update Account",
            nav,
            account_firstname,
            account_lastname,
            account_email
        })

        return
    }

    next()
}

/*******************************
 * Update Password Validation Rules
 ******************************/
validate.passwordRules = ()=>{
    return [
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
 * Process Password Data
 ******************************/
validate.checkPasswordData = async(req, res, next)=>{

    let errors = []

    errors = validationResult(req)

    if(!errors.isEmpty()){
        let nav = await utilities.getNav()

        res.render("account/update",{
            errors,
            title: "Update Account",
            nav,
        })

        return
    }

    next()
}

module.exports = validate