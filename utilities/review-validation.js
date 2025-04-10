const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/*******************************
 * Registration Validation Rules
 ******************************/
validate.reviewRules = ()=>{
    return [
        //score is required and must be an integer [1-5]
        body("review_score")
            .trim()                 // remove leading and trailing whitespace
            .escape()               // replace special characters with HTML entities
            .notEmpty()             // something other than whitespace required
            .isInt({min:1, max:5})                // must be integer between 1-5
            .withMessage("Please provide a valid score (Integer from 1 to 5)."),    //error message

        //review text is required and must be string
        body("review_text")
            .trim()                 // remove leading and trailing whitespace
            .notEmpty()             // something other than whitespace required
            .isLength({min:1})      // At least 1 character long
            .withMessage("Please provide a review."),    //error message
    ]
}

/*******************************
 * Process Write Review
 ******************************/
validate.checkReviewData = async(req, res, next)=>{
    const {
        inv_make,
        inv_model,
        review_score,
        review_text,
    } = req.body

    let errors = []

    errors = validationResult(req)

    if(!errors.isEmpty()){
        let nav = await utilities.getNav()

        res.render("reviews/write",{
            errors,
            title: "Write Review",
            nav,
            review_score,
            review_text,
            inv_make,
            inv_model
        })

        return
    }

    next()
}

/*******************************
 * Process Write Review
 ******************************/
validate.checkEditReview = async(req, res, next)=>{
    const {
        inv_make,
        inv_model,
        review_score,
        review_text,
    } = req.body

    let errors = []

    errors = validationResult(req)

    if(!errors.isEmpty()){
        let nav = await utilities.getNav()

        res.render("reviews/edit",{
            errors,
            title: "Edit Review",
            nav,
            review_score,
            review_text,
            inv_make,
            inv_model
        })

        return
    }

    next()
}

module.exports = validate