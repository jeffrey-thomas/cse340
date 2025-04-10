const invModel = require("../models/inventory-model")
const revModel = require("../models/review-model")
const utilities = require("../utilities")

const revCont = {}

/* ***************************
 *  Build write review view
 * ************************** */
revCont.buildWriteReview = async function(req, res, next){
    let nav = await utilities.getNav()

    const inv_id = req.params.inv_id
    const account_id = res.locals.accountData.account_id

    const data = await invModel.getItemByInventoryId(inv_id)

    res.render("./reviews/write",{
        title:"Write Review",
        nav,
        errors:null,
        inv_make:data.inv_make,
        inv_model:data.inv_model,
        account_id,
        inv_id
    })

}

/* ****************************************
*  Process Write Review Action
* *************************************** */
revCont.createReview = async function(req, res){
    let nav = await utilities.getNav()

    const {
        account_id,
        inv_id,
        inv_make,
        inv_model,
        review_score,
        review_text,
    } = req.body

    const dbResult = await revModel.postReview(account_id,inv_id,review_score,review_text)

    if(dbResult){
        req.flash(
            "notice", 
            `Review successfully submitted.`
        )
        res.redirect(`/inv/detail/${inv_id}`)
    } else {
        req.flash("notice", "Sorry, submitting the review failed.")
        res.status(501).render("/reviews/write",{
            title:"Write Review",
            nav,
            errors:null,
            inv_make,
            inv_model,
            account_id,
            inv_id,
            review_score,
            review_text
        })
    }
}

/* ***************************
 *  Build edit review view
 * ************************** */
revCont.buildEditReview = async function(req, res, next){
    let nav = await utilities.getNav()

    const inv_id = req.params.inv_id
    const account_id = res.locals.accountData.account_id

    const invData = await invModel.getItemByInventoryId(inv_id)
    const revData = await revModel.getUserReview(account_id, inv_id)

    res.render("./reviews/edit",{
        title:"Edit Review",
        nav,
        errors:null,
        inv_make:invData.inv_make,
        inv_model:invData.inv_model,
        account_id,
        inv_id,
        review_score:revData.review_score,
        review_text:revData.review_text
    })

}

/* ****************************************
*  Process Edit Review Action
* *************************************** */
revCont.editReview = async function(req, res){
    let nav = await utilities.getNav()

    const {
        account_id,
        inv_id,
        inv_make,
        inv_model,
        review_score,
        review_text,
    } = req.body

    const dbResult = await revModel.editReview(account_id,inv_id,review_score,review_text)

    if(dbResult){
        req.flash(
            "notice", 
            `Review successfully updated.`
        )
        res.redirect(`/inv/detail/${inv_id}`)
    } else {
        req.flash("notice", "Sorry, updating this review failed.")
        res.status(501).render("/reviews/edit",{
            title:"Edit Review",
            nav,
            errors:null,
            inv_make,
            inv_model,
            account_id,
            inv_id,
            review_score,
            review_text
        })
    }
}

/* ***************************
 *  Build Delete review view
 * ************************** */
revCont.buildDeleteReview = async function(req, res, next){
    let nav = await utilities.getNav()

    const inv_id = req.params.inv_id
    const account_id = res.locals.accountData.account_id

    const invData = await invModel.getItemByInventoryId(inv_id)

    res.render("./reviews/delete",{
        title:"Delete Review",
        nav,
        errors:null,
        inv_make:invData.inv_make,
        inv_model:invData.inv_model,
        account_id,
        inv_id,
    })

}

/* ****************************************
*  Process Delete Review Action
* *************************************** */
revCont.deleteReview = async function(req, res){
    let nav = await utilities.getNav()

    const {
        account_id,
        inv_id,
        inv_make,
        inv_model,
    } = req.body

    const dbResult = await revModel.deleteReview(account_id,inv_id)

    if(dbResult){
        req.flash(
            "notice", 
            `Review successfully deleted.`
        )
        res.redirect(`/inv/detail/${inv_id}`)
    } else {
        req.flash("notice", "Sorry, deleting this review failed.")
        res.status(501).render("/reviews/delete",{
            title:"Delete Review",
            nav,
            errors:null,
            inv_make,
            inv_model,
            account_id,
            inv_id,
        })
    }
}

module.exports = revCont 