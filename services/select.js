var sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.db");

async function getRestaurantTables(req) {
  try {
    const { id } = req.query;
    console.log("daj mi id sad: ", id);
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT user.*, tables.*
                    FROM user
                    INNER JOIN tables ON user.id = tables.restaurant_id 
                    WHERE user.id = ?
                    ORDER BY tables.table_size`,
        [id],
        (err, rows) => {
          if (err) reject(err);
          else {
            resolve(rows);
          }
        }
      );
    });
    //console.log("daj mi row: ", rows);
    return rows;
  } catch (err) {
    console.log(err);
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

    return rows;
  } catch (err) {
    console.error(err.message);
  }
}

async function getRestaurantTermins(req) {
  try {
    const { id } = req.query;
    console.log("daj mi id odmah: ", id);
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT user.*, termin.*
                    FROM user
                    INNER JOIN termin ON user.id = termin.restaurant_id 
                    WHERE user.id = ?`,
        [id],
        (err, rows) => {
          if (err) reject(err);
          else {
            resolve(rows);
          }
        }
      );
    });
    //console.log("daj mi row: ", rows);
    return rows;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
}

async function getRestaurants() {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM user WHERE role = 'admin'", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    console.log("restorani: ", rows);

    return rows;
  } catch (err) {
    console.error(err.message);
  }
}

async function getRestaurant(req) {
  const { id } = req.query;
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM user WHERE id = ?", [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    console.log("restoran: ", rows);

    return rows;
  } catch (err) {
    console.error(err.message);
  }
}

async function getAllTablesAndReservations(req) {
  try {
    const { id } = req.query;
    console.log("daj mi id sad za reservations: ", id);
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT tables.id as tables_id, tables.restaurant_id, tables.table_name, tables.table_size,
        termin.id as termin_id, termin.start_time, termin.end_time,
        reservations.id as reservation_id, reservations.user_id,
        user.email, user.restaurant_name
      FROM tables
        LEFT JOIN termin ON tables.restaurant_id = termin.restaurant_id
        LEFT JOIN reservations ON termin.id = reservations.termin_id AND tables.id = reservations.table_id
      LEFT JOIN user ON tables.restaurant_id = user.id
        WHERE tables.restaurant_id = ?
        ORDER BY tables.table_size ASC`,
        [id],
        (err, rows) => {
          if (err) reject(err);
          else {
            resolve(rows);
          }
        }
      );
    });
    //console.log("daj mi row: ", rows);
    return rows;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
}
async function groupTables(req) {
  try {
    const { id } = req.query;
    console.log("daj mi id sad za reservations: ", id);
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `	SELECT tables.table_size
        FROM tables
          WHERE tables.restaurant_id = ?
          GROUP by tables.table_size`,
        [id],
        (err, rows) => {
          if (err) reject(err);
          else {
            resolve(rows);
          }
        }
      );
    });
    //console.log("daj mi row: ", rows);
    return rows;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
}


module.exports = {
  getRestaurantTables,
  getRestaurantTermins,
  getUser,
  getRestaurants,
  getRestaurant,
  getAllTablesAndReservations,
  groupTables,
};
