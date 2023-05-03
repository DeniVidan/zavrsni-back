var sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.db");
import bcrypt from "bcrypt";
const { getUser } = require("../services/select");

async function createTable(req) {
  const { restaurant_id, name, size } = req.body;
  console.log(
    "restaurant_id, table_name, table_size: ",
    restaurant_id,
    name,
    size
  );
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
  console.log(
    "restaurant_id, start_time, end_time: ",
    restaurant_id,
    start_time,
    end_time
  );
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
    console.log(err);
    throw new Error("Something went wrong!");
  }
}

async function renameTable(req) {
  const { restaurant_id, table_id, table_name } = req.body;
  console.log(
    "restaurant_id, table_id, table_name: ",
    restaurant_id,
    table_id,
    table_name
  );
  const sql = "UPDATE tables SET table_name = ? WHERE id = ?";

  try {
    let table = await new Promise((resolve, reject) => {
      db.run(sql, [table_name, table_id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            table_name: table_name,
            table_id: table_id,
          });
        }
      });
    });
    console.log("Tables updated successfully: ", table);
    return { table };
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
}





async function editUser(req, res) {
  const { id, firstname, lastname, password, newPassword, token } = req.body;
  console.log(
    "firstname, lastname, password, newPassword: ",
    id,
    firstname,
    lastname,
    password,
    newPassword,
    token
  );
  let user = await getUser(id);
  console.log("user length: ", user[0].password);

  try {
    if (user.length === 0) {
      return { message: "User not found" };
    }

    // compare old password with bcrypt
    if (password != "" && newPassword != "") {
      const passwordMatch = await bcrypt.compare(password, user[0].password);

      if (!passwordMatch) {
        console.log("su krive lozinke: ", passwordMatch)
        return res.status(401).json({ message: "Invalid old password" });
      }
    }

    let hashedPassword = user[0].password;
    let updatedFields = {};

    // hash new password if entered
    if (newPassword && newPassword !== "") {
      hashedPassword = await bcrypt.hash(newPassword, 8);
      updatedFields.password = hashedPassword;
    }

    // update user info
    if (firstname && firstname !== "") {
      updatedFields.firstname = firstname;
    }

    if (lastname && lastname !== "") {
      updatedFields.lastname = lastname;
    }

    if (Object.keys(updatedFields).length > 0) {
      let updated = await new Promise((resolve, reject) => {
        let user = db.run(
          `UPDATE user SET 
            firstname = COALESCE(?, firstname),
            lastname = COALESCE(?, lastname),
            password = COALESCE(?, password)
            WHERE id = ?`,
          [
            updatedFields.firstname || null,
            updatedFields.lastname || null,
            updatedFields.password || null,
            id
          ],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(user);
            }
          }
        );
      });

      console.log("updated: ", user);

      return {
        user: {
          token,
          firstname: updatedFields.firstname || user[0].firstname,
          lastname: updatedFields.lastname || user[0].lastname,
          email: user[0].email,
          role: user[0].role,
        },

        message: "User info updated successfully tnx",
      };
    } else {
      return {
        user: {
          token,
          firstname: user[0].firstname,
          lastname: user[0].lastname,
          email: user[0].email,
          role: user[0].role,
        },

        message: "No changes made",
      };
    }
  } catch (err) {
    console.error("daj error vise: !", err);
    return { message: "Server error" };
  }
}

async function reserveTable(req) {
  const { restaurant_id, user_id, table_id, termin_id, day, month, year } = req.body;
  console.log(
    "restaurant_id, user_id, table_id, termin_id: ",
    restaurant_id,
    user_id,
    table_id,
    termin_id,
    day, month, year
  );
  const sql = "INSERT INTO reservations (restaurant_id, user_id, table_id, termin_id, day, month, year) VALUES (?, ?, ?, ?, ?, ?, ?)";

  try {
    let reservation = await new Promise((resolve, reject) => {
      let rows = db.run(sql, [restaurant_id, user_id, table_id, termin_id, day, month, year], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            rows
          });
        }
      });
    });
    console.log("Table reserved successfully: ", reservation);
    return { reservation };
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
}

async function rateRestaurant(req) {
  const { restaurant_id, user_id, rate } = req.body;
  console.log(
    "restaurant_id, user_id, rate: ",
    restaurant_id,
    user_id,
    rate
  );
  const sql = "INSERT INTO restaurant_rating (restaurant_id, user_id, rate) VALUES (?, ?, ?)";

  try {
    let rating = await new Promise((resolve, reject) => {
      let rows = db.run(sql, [restaurant_id, user_id, rate], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            rows
          });
        }
      });
    });
    console.log("Restaurant rated successfully: ", rating);
    return { rating };
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
}

module.exports = { createTable, createTermin, renameTable, editUser, reserveTable, rateRestaurant };
