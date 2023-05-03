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
      db.all(
        `SELECT user.id as restaurant_id, user.firstname, user.lastname, user.email, user.restaurant_name, user.location, user.role,
                ROUND(AVG(restaurant_rating.rate), 2) as avg_rating
          FROM user
          LEFT JOIN restaurant_rating ON user.id = restaurant_rating.restaurant_id
          WHERE user.role = 'admin'
          GROUP BY restaurant_rating.restaurant_id
        `,
        [],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
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
    const { id, day, month, year } = req.query;
    console.log("daj mi id sad za reservations: ", id);
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT tables.id as tables_id, tables.restaurant_id, tables.table_name, tables.table_size,
        termin.id as termin_id, termin.start_time, termin.end_time,
        user.email, user.restaurant_name, reservations.id as reservation_id, reservations.day
        FROM termin
          LEFT JOIN tables ON termin.restaurant_id = tables.restaurant_id
          LEFT JOIN reservations ON tables.id = reservations.table_id AND termin.id = reservations.termin_id
          LEFT JOIN user ON tables.restaurant_id = user.id
          WHERE tables.restaurant_id = ?
          
      EXCEPT
      
      SELECT tables.id as tables_id, tables.restaurant_id, tables.table_name, tables.table_size,
              termin.id as termin_id, termin.start_time, termin.end_time,
              user.email, user.restaurant_name, reservations.id as reservation_id, reservations.day
            FROM termin
              LEFT JOIN tables ON termin.restaurant_id = tables.restaurant_id
          LEFT JOIN reservations ON tables.id = reservations.table_id AND termin.id = reservations.termin_id
          LEFT JOIN user ON tables.restaurant_id = user.id
              WHERE tables.restaurant_id = ? AND reservations.day = ?
              ORDER BY tables.table_size`,
        [id, id, day],
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

async function getAllRestaurantsReservations(req) {
  try {
    const { id, day, month, year } = req.query;
    console.log("daj mi id sad za reservations: ", id, day, month, year);
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT user.email as restaurant_email, reservations_users.reservation_id as reservation_id, reservations_users.user_id, reservations_users.email, reservations_users.firstname, reservations_users.lastname, reservations_users.table_id, reservations_users.termin_id, termin.start_time, termin.end_time
        FROM user
        LEFT JOIN reservations_users ON user.id = reservations_users.restaurant_id
        LEFT JOIN termin ON reservations_users.termin_id = termin.id
        WHERE reservations_users.restaurant_id = ? AND reservations_users.day = ? AND reservations_users.month = ? AND reservations_users.year = ?`,
        [id, day, month, year],
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

async function getRestaurantRating(req) {
  try {
    const { restaurant_id } = req.query;
    console.log("daj mi id sad za rating: ", restaurant_id);
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT user.restaurant_name, user.email, restaurant_rating.*, ((SUM(restaurant_rating.rate))/(COUNT(restaurant_rating.rate))) as rate
        FROM user
        LEFT JOIN restaurant_rating ON user.id = restaurant_rating.restaurant_id
        WHERE user.role = 'admin' AND user.id = ?`,
        [restaurant_id],
        (err, rows) => {
          if (err) reject(err);
          else {
            resolve(rows);
          }
        }
      );
    });
    console.log("ČA REJTING: ", rows);
    return rows;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
}

async function getUserRestaurantRating(req) {
  try {
    const { user_id, restaurant_id } = req.query;
    console.log("daj mi id sad za rating: ", user_id, restaurant_id);
    const rows = await new Promise((resolve, reject) => {
      db.all(`SELECT user.id as user_id, user.firstname, user.lastname, user.email, user.role, restaurant_rating.*
                FROM user
                LEFT JOIN restaurant_rating ON user.id = restaurant_rating.user_id
                WHERE user.id = ? AND restaurant_rating.restaurant_id = ?`, [user_id, restaurant_id], (err, rows) => {
        if (err) reject(err);
        else {
          resolve(rows);
        }
      });
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
  getAllRestaurantsReservations,
  getRestaurantRating,
  getUserRestaurantRating,
};
