const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

//Serve Login Form
router.get("/login", utilities.handleErrors(accountController.buildLogin))

//Serve Registration Form
router.get("/register", utilities.handleErrors(accountController.buildRegister))

//Process Registration Attempt
router.post(
    "/register", 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

//Process Login Attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    (req,res)=>{
        res.status(200).send('login process')
    }
)

module.exports = router;