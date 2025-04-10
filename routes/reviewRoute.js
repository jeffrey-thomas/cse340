const express = require("express")
const router = new express.Router()
const revController = require("../controllers/reviewController")
const utilities = require("../utilities")
const revValidate = require("../utilities/review-validation")

/*********************
 * REVIEWS ROUTES
 ********************/
//Serve Create Review Form
router.get("/write/:inv_id", utilities.checkLogin, utilities.handleErrors(revController.buildWriteReview) )

//Process Create Review Form
router.post(
    "/write",
    revValidate.reviewRules(),
    revValidate.checkReviewData,
    utilities.handleErrors(revController.createReview)
)

//Serve Edit Review Form
router.get("/edit/:inv_id", utilities.checkLogin, utilities.handleErrors(revController.buildEditReview) )

//Process Edit Review Form
router.post(
    "/edit",
    revValidate.reviewRules(),
    revValidate.checkEditReview,
    utilities.handleErrors(revController.editReview)
)

//Serve Delete Review Form
router.get("/delete/:inv_id", utilities.checkLogin, utilities.handleErrors(revController.buildDeleteReview) )

//Process Delete Review Form
router.post(
    "/delete",
    utilities.handleErrors(revController.deleteReview)
) 

module.exports = router