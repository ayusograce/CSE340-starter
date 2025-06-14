// REQUIRED
const pool = require("../database/")

/* *****************************
*   Register new comment
* *************************** */
async function registerComment(comment_text, inv_id, account_id){
    try{
        const sql = `INSERT INTO comments (comment_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *`
        return await pool.query(sql, [comment_text, inv_id, account_id])
    } catch(error){
        return error.message
    }
}

/* *****************************
* Return comment data using the inventory id
* ***************************** */
async function getComments (inv_id) {
  try {
    const result = await pool.query(
      `SELECT c.*, a.account_firstname || ' ' || a.account_lastname AS author
      FROM comments c
      JOIN account a ON c.account_id = a.account_id
      WHERE inv_id = $1
      ORDER BY comment_date DESC;`,
      [inv_id])
    return result.rows
  } catch (error) {
    throw new Error(`Error getting comments by inventory_id: ${error.message}`)
  }
}

module.exports = {registerComment, getComments};