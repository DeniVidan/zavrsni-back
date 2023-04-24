var sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.db");


async function deleteTermin(req) {
    const { id } = req.query;
    console.log("id termin: ", id);
    const sql =
      "DELETE FROM termin WHERE id = ?";
  
    try {
      let termin = await new Promise((resolve, reject) => {
        db.run(sql, [id], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(termin);
          }
        });
      });
      console.log("Termin deleted successfully: ", termin);
      return { termin };
    } catch (err) {
      console.log(err)
      throw new Error("Something went wrong!");
    }
  }

  async function deleteTable(req) {
    const { id } = req.query;
    console.log("id table: ", id);
    const sql =
      "DELETE FROM tables WHERE id = ?";
  
    try {
      let table = await new Promise((resolve, reject) => {
        db.run(sql, [id], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(table);
          }
        });
      });
      console.log("Table deleted successfully: ", table);
      return { table };
    } catch (err) {
      console.log(err)
      throw new Error("Something went wrong!");
    }
  }






module.exports = { deleteTermin, deleteTable }
