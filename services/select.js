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
   // console.log("user: ", rows);

    return rows;
  } catch (err) {
    console.error(err.message);
  }
}

async function getRestaurantGallery(id) {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM restaurant_gallery rg WHERE rg.restaurant_id = ?", [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
   // console.log("user: ", rows);

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
        `SELECT u.id as restaurant_id, u.firstname, u.lastname, u.email, u.restaurant_name, u.location, u.role, ROUND(AVG(r.rate), 1) AS avg_rate, ri.description, u.image
        FROM user u
        LEFT JOIN rates r ON u.id = r.restaurant_id
		    LEFT JOIN restaurant_info ri ON u.id = ri.restaurant_id
        WHERE u.role = 'admin'
        GROUP BY u.email
        `,
        [],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    //console.log("restoranici: ", rows);

    return rows;
  } catch (err) {
    console.error(err.message);
  }
}

async function getRestaurant(req) {
  const { id } = req.query;
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(`
      SELECT u.id as restaurant_id, u.firstname, u.lastname, u.email, u.restaurant_name, u.location, u.role, ROUND(AVG(r.rate), 1) AS avg_rate, ri.description, u.image
      FROM user u
      LEFT JOIN rates r ON u.id = r.restaurant_id
      LEFT JOIN restaurant_info ri ON u.id = ri.restaurant_id
      WHERE u.id = ?
      GROUP BY u.email`,
       [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    //console.log("restoran: ", rows);

    return rows;
  } catch (err) {
    console.error(err.message);
  }
}

async function getUserRate(req) {
  const { restaurant_id } = req.query;
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT *
      FROM restaurant_rating rr
      WHERE rr.restaurant_id = ?`,
        [restaurant_id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    console.log("restoran rate: ", rows);

    return rows;
  } catch (err) {
    console.error(err.message);
  }
}

async function getAllTablesAndReservations(req) {
  try {
    const { id, day, month, year } = req.query;
    //console.log("daj mi id sad za reservations: ", id);
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM (SELECT tables.id as tables_id, tables.restaurant_id, tables.table_name, tables.table_size,
          termin.id as termin_id, termin.start_time, termin.end_time,
          user.email, user.restaurant_name
          FROM termin
            LEFT JOIN tables ON termin.restaurant_id = tables.restaurant_id
            LEFT JOIN user ON tables.restaurant_id = user.id
            WHERE tables.restaurant_id = ?
        
  EXCEPT
  
  SELECT * FROM (      SELECT tables.id as tables_id, tables.restaurant_id, tables.table_name, tables.table_size,
                termin.id as termin_id, termin.start_time, termin.end_time,
                user.email, user.restaurant_name
        FROM termin
        LEFT JOIN tables ON termin.restaurant_id = tables.restaurant_id
        LEFT JOIN pending ON tables.id = pending.table_id AND termin.id = pending.termin_id
        LEFT JOIN user ON tables.restaurant_id = user.id
        WHERE tables.restaurant_id = ? AND pending.day = ?
                
          
  UNION			  
          
          
    SELECT tables.id as tables_id, tables.restaurant_id, tables.table_name, tables.table_size,
                termin.id as termin_id, termin.start_time, termin.end_time,
                user.email, user.restaurant_name
      FROM termin
      LEFT JOIN tables ON termin.restaurant_id = tables.restaurant_id
      LEFT JOIN reservations ON tables.id = reservations.table_id AND termin.id = reservations.termin_id
      LEFT JOIN user ON tables.restaurant_id = user.id
          WHERE tables.restaurant_id = ? AND reservations.day = ?
          ORDER BY tables.table_size))`,
        [id, id, day, id, day],
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
    //console.log("daj mi id sad za reservations: ", id);
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
    //console.log("daj mi id sad za reservations: ", id, day, month, year);
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT user.email as restaurant_email, reservations_users.reservation_id as reservation_id, reservations_users.user_id, reservations_users.email, reservations_users.firstname, reservations_users.lastname, reservations_users.table_id, reservations_users.termin_id, reservations_users.name, termin.start_time, termin.end_time
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
    const { user_id, restaurant_id } = req.query;
    //console.log("daj mi id sad za rating: ", restaurant_id, user_id);
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT u.id, u.firstname, u.lastname, u.email, u.restaurant_name, u.role,r.user_id, r.rate as rate
        FROM user u
        LEFT JOIN rates r ON u.id = r.restaurant_id
        WHERE u.role = 'admin' AND u.id = ? AND r.user_id = ?
        GROUP BY u.email
      
      
        `,
        [restaurant_id, user_id],
        (err, rows) => {
          if (err) reject(err);
          else {
            resolve(rows);
          }
        }
      );
    });
    //console.log(": ", rows);
    return rows;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
}

async function getUserRestaurantRating(req) {
  try {
    const { user_id, restaurant_id } = req.query;
    //console.log("daj mi id sad za rating: ", user_id);
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT u.id as user_id, u.firstname, u.lastname, u.email, rr.restaurant_id, rr. rate, rr.review, rr.date_time, rr.id as review_id
        FROM user u
        LEFT JOIN restaurant_rating rr ON u.id = rr.user_id
        WHERE u.id = ? AND rr.restaurant_id = ?`,
        [user_id, restaurant_id],
        (err, rows) => {
          if (err) reject(err);
          else {
            resolve(rows);
          }
        }
      );
    });
    //console.log(": ", rows);
    return rows;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
}

async function getProfileImage(req) {
  const { user_id } = req.query;
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT user.image
        FROM user
        WHERE user.id = ?`,
        [user_id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    //console.log("user image: ", rows);

    return rows;
  } catch (err) {
    console.error(err.message);
  }
}

async function getPending(req) {
  const { restaurant_id } = req.query;
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT pu.id as user_id, pu.firstname, pu.lastname, pu.email, pu.pending_id, pu.restaurant_id, pu.table_id, pu.termin_id, pu.day, pu.month, pu.year, pu.name, pu.date_time,
        ta.table_name, ta.table_size, te.start_time, te.end_time
      FROM pending_users pu
      LEFT JOIN tables ta ON pu.table_id = ta.id
      LEFT JOIN termin te ON pu.termin_id = te.id
      WHERE pu.restaurant_id = ?`,
        [restaurant_id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    console.log("user penfing: ", rows);

    return rows;
  } catch (err) {
    console.error(err.message);
  }
}

async function getUserReservations(req) {
  const { id } = req.query;
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT ru.id, ru.firstname, ru.lastname, ru.email, ru.role, ru.day, ru.month, ru.year, t.start_time, t.end_time, u.restaurant_name, ru.reservation_id
        FROM reservations_users ru
        LEFT JOIN termin t ON t.id = ru.termin_id
        LEFT JOIN user u ON u.id = ru.restaurant_id
        WHERE ru.id = ?`,
        [id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    console.log("user reservations: ", rows);

    return rows;
  } catch (err) {
    console.error(err.message);
  }
}

async function getDescription(req) {
  const { restaurant_id } = req.query;
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT ri.description
          FROM restaurant_info ri
          WHERE ri.restaurant_id = ?`,
        [restaurant_id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    console.log("restaurant description: ", rows);

    return rows;
  } catch (err) {
    console.error(err.message);
  }
}


async function getAllReviews(req) {
  const { id } = req.query;
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(
      `SELECT rr.id, rr.restaurant_id, rr.user_id, rr.rate, rr.review, ri.id as review_img_id, ri.image as review_image, u.firstname, u.lastname, u.email, u.image
      FROM restaurant_rating rr
      LEFT JOIN review_images ri ON rr.id = ri.rate_id
      LEFT JOIN user u ON rr.user_id = u.id
      WHERE rr.restaurant_id = ?
      ORDER BY rr.id DESC`,
       [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    //console.log("restaurant reviews: ", rows);

    return rows;
  } catch (err) {
    console.error(err.message);
  }
}

async function getAllRestaurantsImages(req) {
  const { id } = req.query;
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(
      `SELECT rr.images
      FROM restaurant_rating rr
      WHERE rr.restaurant_id = ?`,
       [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    //console.log("restaurant images: ", rows);

    return rows;
  } catch (err) {
    console.error(err.message);
  }
}




async function getGallery(req) {
  const { id } = req.query;
  console.log("id: ", id)
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * 
            FROM restaurant_gallery rg
            WHERE rg.restaurant_id = ?`,
        [id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
//    console.log("restaurant gallery: ", rows);

    return rows;
  } catch (err) {
    console.error(err.message);
  }
}


module.exports = {
  getRestaurantTables,
  getRestaurantTermins,
  getUser,
  getRestaurantGallery,
  getRestaurants,
  getRestaurant,
  getAllTablesAndReservations,
  groupTables,
  getAllRestaurantsReservations,
  getRestaurantRating,
  getUserRestaurantRating,
  getUserRate,
  getProfileImage,
  getPending,
  getUserReservations,
  getDescription,
  getAllReviews,
  getAllRestaurantsImages,
  getGallery,
};
