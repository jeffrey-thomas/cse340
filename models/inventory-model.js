const pool = require("../database")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

async function getClassificationName(classification_id){
  const data = await pool.query("SELECT classification_name FROM public.classification WHERE classification_id = $1",[classification_id])
  return data.rows[0].classification_name
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get a single inventory item by inventory_id
 * ************************** */
async function getItemByInventoryId(inventory_id){
  try{
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i WHERE i.inv_id = $1`,
      [inventory_id]
    )
    return data.rows[0]
  } catch(error){
    console.error("getItemByInventoryId error"+error)
  }
}

/* *****************************
*   Add a new classification
* *************************** */
async function addClassification(classification_name){
  try{
      const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"

      return await pool.query(sql, [classification_name])
  } catch(error){
      return error.message
  }
}

/* *****************************
*   Add a new vehicle
* *************************** */
async function addVehicle(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color){
  try{
      const sql = `INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`

      return await pool.query(sql, [
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
      ])
  } catch(error){
      return error.message
  }
}

/* *****************************
*   Update vehicle
* *************************** */
async function updateVehicle(
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_year,
  inv_price,    
  inv_miles,
  inv_color,
  classification_id,
  inv_id
){

  try{
    const sql = "UPDATE public.inventory SET inv_make=$1, inv_model=$2, inv_description=$3, inv_image=$4, inv_thumbnail=$5, inv_year=$6, inv_price=$7, inv_miles=$8, inv_color=$9, classification_id=$10 WHERE inv_id = $11 RETURNING *"

    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_year,
      inv_price,    
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])

    return data.rows[0]

  } catch(error){
    console.error(`model error: ${error}`)
  }
}

/* *****************************
*   Update vehicle
* *************************** */
async function deleteVehicle(inv_id){

  try{
    const sql = "DELETE FROM public.inventory WHERE inv_id = $1"

    const data = await pool.query(sql, [inv_id])

    return data

  } catch(error){
    console.error(`model delete error: ${error}`)
  }
}

module.exports = {
  getClassifications, 
  getClassificationName, 
  getInventoryByClassificationId, 
  getItemByInventoryId, 
  addClassification, 
  addVehicle, 
  updateVehicle,
  deleteVehicle
}
