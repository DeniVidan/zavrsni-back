var sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.db");


async function getRestaurantTables(req) {
    
    try {
      const { id } = req.query
      console.log("daj mi id: ", id)
      const rows = await new Promise((resolve, reject) => {
        db.all(`SELECT tables.*, user.* 
                    FROM tables
                    INNER JOIN user ON tables.restaurant_id = user.id
                    WHERE restaurant_id = ?`, [id], (err, rows) => {
          if (err) reject(err);
          else {
                resolve(rows)
          }
        });
      });
      //console.log("daj mi row: ", rows);
      return rows
    } catch (err) {
      console.log(err)
      throw new Error("Something went wrong!");
    }
  }


module.exports = { getRestaurantTables }
