var sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.db");


async function getRestaurantTables(req) {
    
    try {
      const { id } = req.query
      console.log("daj mi id: ", id)
      const rows = await new Promise((resolve, reject) => {
        db.all(`SELECT user.*, tables.*
                    FROM user
                    INNER JOIN tables ON user.id = tables.restaurant_id 
                    WHERE user.id = ?
                    ORDER BY tables.table_size`, [id], (err, rows) => {
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


  async function getUser(id) {

      try {
        const rows = await new Promise((resolve, reject) => {
          db.all("SELECT * FROM user WHERE id = ?", [id], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          });
        });
        console.log("user: ", rows);
        
        return rows
      } catch (err) {
        console.error(err.message);
      }
  }



  async function getRestaurantTermins(req) {
    
    try {
      const { id } = req.query
      console.log("daj mi id: ", id)
      const rows = await new Promise((resolve, reject) => {
        db.all(`SELECT user.*, termin.*
                    FROM user
                    INNER JOIN termin ON user.id = termin.restaurant_id 
                    WHERE user.id = ?`, [id], (err, rows) => {
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


module.exports = { getRestaurantTables, getRestaurantTermins, getUser }
