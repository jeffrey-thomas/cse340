const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/login",{
        title:"Login",
        nav,
        errors:null
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/register",{
        title:"Register",
        nav,
        errors:null
    }) 
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res){
    let nav = await utilities.getNav()

    const {
        account_firstname, 
        account_lastname, 
        account_email, 
        account_password
    } = req.body

    let hashedPassword
    try{
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch(error){
        req.flash("notice","Sorry, there was an error processing the registration.")
        res.status(500).render("account/register",{
            title:"Registration",
            nav,
            errors:null
        })
    }

    const dbResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if(dbResult){
        req.flash(
            "notice", 
            `Congratulations! You're registered, ${account_firstname}. Please log in.`
        )

        res.status(201).render("account/login",{
            title:"Login",
            nav,
            errors:null
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register",{
            title:"Registration",
            nav
        })
    }
}

/**************************
 * Login Process
 *************************/
async function accountLogin(req,res){
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    
    //Email not registered
    if(!accountData){
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login",{
            title:"Login",
            nav,
            errors:null,
            account_email
        })
        return
    }

    try{
        if(await bcrypt.compare(account_password, accountData.account_password)){
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600*1000})
            if(process.env.NODE_ENV === 'development'){
                res.cookie("jwt", accessToken, {httpOnly:true, maxAge:3600*1000})
            } else {
                res.cookie("jwt", accessToken, {httpOnly:true, secure:true, maxAge:3600*1000})
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("message notice", "Please check your credentails and try again.")
            res.status(400).render("account/login",{
                title:"Login",
                nav,
                errors:null,
                account_email
            })
        }
    } catch(error) {
        throw new Error("Access Forbidden")
    }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildManagement(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/management",{
        title:"Account Management",
        nav,
        errors:null
    }) 
}

/* ****************************************
*  Deliver account update view
* *************************************** */
async function buildUpdate(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/update",{
        title:"Update Account",
        nav,
        errors:null
    }) 
}

/* ****************************************
*  Process Update Info
* *************************************** */
async function updateAccount(req, res){
    let nav = await utilities.getNav()

    const {
        account_id,
        account_firstname, 
        account_lastname, 
        account_email, 
    } = req.body

    const dbResult = await accountModel.updateAccount(
        account_id,
        account_firstname,
        account_lastname,
        account_email,
    )

    if(dbResult){

        const accountData = await accountModel.getAccountById(account_id)

        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600*1000})
        if(process.env.NODE_ENV === 'development'){
            res.cookie("jwt", accessToken, {httpOnly:true, maxAge:3600*1000})
        } else {
            res.cookie("jwt", accessToken, {httpOnly:true, secure:true, maxAge:3600*1000})
        }

        req.flash(
            "notice", 
            `Success! Your account has been updated.`
        )

        return res.redirect("/account/")

    } else {
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("account/update",{
            title:"Update Account",
            nav
        })
    }
}

/* ****************************************
*  Process Password Update
* *************************************** */
async function updatePassword(req, res){
    let nav = await utilities.getNav()

    const {
        account_id,
        account_password
    } = req.body

    let hashedPassword
    try{
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch(error){
        req.flash("notice","Sorry, there was an error processing the registration.")
        res.status(500).render("account/update",{
            title:"Update Account",
            nav,
            errors:null
        })
    }

    const dbResult = await accountModel.updatePassword(
        account_id,
        hashedPassword
    )

    if(dbResult){
        req.flash(
            "notice", 
            `Success! Your password has been updated.`
        )

        return res.redirect("/account/")

    } else {
        req.flash("notice", "Sorry, the password update failed.")
        res.status(501).render("account/update",{
            title:"Update Account",
            nav
        })
    }
}

async function logout(req, res){
    res.clearCookie('jwt')
    res.redirect("/")
}

module.exports = { 
    buildLogin, 
    buildRegister, 
    registerAccount, 
    accountLogin, 
    buildManagement, 
    buildUpdate,
    updateAccount,
    updatePassword,
    logout
}