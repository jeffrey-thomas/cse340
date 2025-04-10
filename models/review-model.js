const pool = require("../database")

/* *****************************
*   Post new review
* *************************** */
async function postReview(account_id, inv_id, review_score, review_text){
    try{
        const sql = "INSERT INTO public.review (account_id, inv_id, review_score, review_text) VALUES ($1, $2, $3, $4) RETURNING *"

        return await pool.query(sql, [account_id, inv_id, review_score, review_text])

    } catch(error){
        return error.message
    }
} 

/* *****************************
*   Delete review
* *************************** */
async function deleteReview(account_id, inv_id){
    try{

        const sql = "DELETE FROM public.review WHERE account_id = $1 AND inv_id = $2"

        return await pool.query(sql, [account_id, inv_id])
        
    } catch(error){
        return error.message
    }
}

/* *****************************
*   Edit Review
* *************************** */
async function editReview(account_id, inv_id, review_score, review_text){
  
    try{
      const sql = "UPDATE public.review SET review_score=$3, review_text=$4 WHERE account_id = $1 AND inv_id = $2 RETURNING *"
  
      const data = await pool.query(sql, [account_id, inv_id, review_score, review_text])
  
      return data.rows[0]
  
    } catch(error){
      console.error(`model error: ${error}`)
    }
}

/* ***************************
 *  Get reviews for item by inv_id
 * ************************** */
async function getReviews(inv_id){
    try{

        const data = await pool.query(`
            SELECT r.account_id, account_firstname, r.inv_id, inv_make, inv_model, review_id, review_score, review_text 
            FROM public.review AS r 
                JOIN public.inventory AS i ON i.inv_id = r.inv_id
                JOIN public.account AS a ON a.account_id = r.account_id  
            WHERE r.inv_id = $1`,
            [inv_id])

        return data.rows

    } catch(error){
        console.error(`model error: ${error}`)
    }
}

/* ***************************
 *  Get user's review for item by inv_id and account_id
 * ************************** */
async function getUserReview(account_id, inv_id){
    try{

        const data = await pool.query(`
            SELECT r.account_id, account_firstname, r.inv_id, inv_make, inv_model, review_id, review_score, review_text 
            FROM public.review AS r 
                JOIN public.inventory AS i ON i.inv_id = r.inv_id
                JOIN public.account AS a ON a.account_id = r.account_id  
            WHERE r.account_id = $1 AND r.inv_id = $2`,
            [account_id, inv_id])

        return data.rows[0]

    } catch(error){
        console.error(`model error: ${error}`)
    }
}

module.exports = { postReview, editReview, deleteReview, getReviews, getUserReview }