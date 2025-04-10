const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function(req, res, next){
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home Page">Home</a></li>'
    data.rows.forEach((row)=>{
        list += `
        <li>
        <a 
            href="/inv/type/${row.classification_id}" 
            title="See inventory of ${row.classification_name} vehicles"
        >${row.classification_name}</a>
        </li>
        `
    })
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid = ''
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + ' details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

/* **************************************
* Build the item detail view HTML
* ************************************ */
Util.buildItemDetails = async function(data){

    if(!data)
        return '<p class="notice">Sorry, we could not find that vehicle.</p>'

    let details = `
        <div id="details">
            <img id="details-img" src="${data.inv_image}" alt="${data.inv_year} ${data.inv_make} ${data.inv_model}">
            <div id="details-info">
                <h2>${data.inv_make} ${data.inv_model} Details</h2>
                <ul>
                    <li>
                        <span class="details-label">Price:</span> $${new Intl.NumberFormat('en-US').format(data.inv_price)}
                    </li>
                    <li>
                        <span class="details-label">Description:</span> ${data.inv_description}
                    </li>
                    <li>
                        <span class="details-label">Color:</span> ${data.inv_color}
                    </li>
                    <li>
                        <span class="details-label">Miles:</span> ${new Intl.NumberFormat('en-US').format(data.inv_miles)}
                    </li>
                </ul>
            </div>
        </div>
    `
    return details
}

/* **************************************
* Build the item review section
* ************************************ */
Util.buildItemReviews = async function(account_id, inv_id, allReviews, userReview){

    //Begin Section - Heading
    let reviews = `
        <div id="reviews">
            <h2>Reviews</h2>
    `
    //Add - Edit - Delete Options
    //if loggedin
    if(account_id != null)
        if(!userReview && account_id){
            reviews += `<a href="/reviews/write/${inv_id}" title="Clicke to Write a review">Write a review</a>`
        } else {
            reviews += `
                <a href="/reviews/edit/${inv_id}" title="Click to edit your review">Edit Review</a>
                <a href="/reviews/delete/${inv_id}" title="Click to delete your review">Delete Review</a> 
            `
        }

    //review display
    if(allReviews.length===0)
        reviews += '<p>There are currently no reviews for this product.</p>'
    else{
        allReviews.forEach(review=>{
            reviews += `
                <div class="item-review">
                    <p>${review.review_score}/5</p>
                    <p>"${review.review_text}" --${review.account_firstname}</p>
                </div>
            `
        })
    }

    //End section
    reviews += "</div>"

   return reviews
}

/********************************
 * Build classification drop down
 ********************************/
Util.buildClassificationMenu = async function(classification_id=null){
    let data = await invModel.getClassifications()
    let menu = `<select name="classification_id" id="select-classification" required>`
    let options = ''
    let hasSelection = false
    data.rows.forEach((row)=>{
        options += `<option value='${row.classification_id}'`

        if(classification_id!=null && row.classification_id == classification_id){
            options += ' selected'
            hasSelection = true
        }

        options+=`>${row.classification_name}</option>`
    })

    menu+="<option value='' disabled"
    if(!hasSelection)
        menu+=" selected"

    menu += ">Choose a Classification</option>"
    menu += options
    menu += '</select>'
    return menu
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            }
        )
    } else {
        next()
    }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

/* ****************************************
 *  Check is employee or admin
 * ************************************ */
Util.checkEmployment = (req, res, next) => {
    if (res.locals.loggedin && res.locals.accountData.account_type !== "Client") {
        next()
    } else {
        req.flash("notice", "This account is not authorized for that resource.")
        return res.redirect("/account/login")
    }
}

module.exports = Util