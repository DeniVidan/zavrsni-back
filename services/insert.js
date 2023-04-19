var sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.db");

async function createTable(req) {
  const { restaurant_id, name, size } = req.body;
  console.log("restaurant_id, table_name, table_size: ", restaurant_id, name, size);
  const sql =
    "INSERT INTO tables (restaurant_id, table_name, table_size) VALUES (?, ?, ?)";

  try {
    let table = await new Promise((resolve, reject) => {
      db.run(sql, [restaurant_id, name, size], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            restaurant_id: restaurant_id,
            name: name,
            size: size,
          });
        }
      });
    });
    console.log("Tables inserted successfully: ", table);
    return { table };
  } catch (err) {
    throw new Error("Something went wrong!");
  }
}

async function createTermin(req) {
  const { restaurant_id, start_time, end_time } = req.body;
  console.log("restaurant_id, start_time, end_time: ", restaurant_id, start_time, end_time);
  const sql =
    "INSERT INTO termin (restaurant_id, start_time, end_time) VALUES (?, ?, ?)";

  try {
    let termin = await new Promise((resolve, reject) => {
      db.run(sql, [restaurant_id, start_time, end_time], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            restaurant_id: restaurant_id,
            start_time: start_time,
            end_time: end_time,
          });
        }
      });
    });
    console.log("Termins inserted successfully: ", termin);
    return { termin };
  } catch (err) {
    console.log(err)
    throw new Error("Something went wrong!");
  }
}






module.exports = { createTable, createTermin }
