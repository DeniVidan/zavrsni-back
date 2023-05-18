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

  async function deletePending(req) {
    const { id } = req.query;
    console.log("id pending: ", id);
    const sql =
      "DELETE FROM pending WHERE id = ?";
  
    try {
      let pending = await new Promise((resolve, reject) => {
        db.run(sql, [id], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(pending);
          }
        });
      });
      console.log("Pending deleted successfully: ", pending);
      return { pending };
    } catch (err) {
      console.log(err)
      throw new Error("Something went wrong!");
    }
  }

  async function deleteReservation(req) {
    const { reservation_id } = req.query;
    console.log("id reservation: ", reservation_id);
    const sql =
      "DELETE FROM reservations WHERE id = ?";
  
    try {
      let reservation = await new Promise((resolve, reject) => {
        db.run(sql, [reservation_id], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(reservation);
          }
        });
      });
      console.log("Reservation deleted successfully: ", reservation);
      return { reservation };
    } catch (err) {
      console.log(err)
      throw new Error("Something went wrong!");
    }
  }

  async function deleteCode(req) {
    const { email } = req.query;
    console.log("email verfy delete: ", email);
    const sql =
      "DELETE FROM verify WHERE email = ?";
  
    try {
      let verify = await new Promise((resolve, reject) => {
        db.run(sql, [email], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(verify);
          }
        });
      });
      console.log("Verify code deleted successfully: ", verify);
      return { verify };
    } catch (err) {
      console.log(err)
      throw new Error("Something went wrong!");
    }
  }




module.exports = { deleteTermin, deleteTable, deletePending, deleteReservation, deleteCode }
