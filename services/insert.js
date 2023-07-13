var sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.db");
const bcrypt = require("bcrypt");
const { getUser, getRestaurantGallery } = require("../services/select");

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

  try {
    let user = await getUser(id);

    if (user.length === 0) {
      return res.status(500).send({ message: "User not found" });
    }

    if (password && newPassword) {
      const passwordMatch = await bcrypt.compare(password, user[0].password);

      if (!passwordMatch) {
        console.log("su krive lozinke: ", passwordMatch);
        return res.status(400).send({ message: "Invalid old password" });
      }
    }

    const updatedFields = {};

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 8);
      updatedFields.password = hashedPassword;
    }

    if (firstname) {
      updatedFields.firstname = firstname;
    }

    if (lastname) {
      updatedFields.lastname = lastname;
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(200).send({
        user: {
          token,
          firstname: user[0].firstname,
          lastname: user[0].lastname,
          email: user[0].email,
          role: user[0].role,
        },
        message: "No changes made",
      });
    }

    db.run(
      `UPDATE user SET 
        firstname = COALESCE(?, firstname),
        lastname = COALESCE(?, lastname),
        password = COALESCE(?, password)
        WHERE id = ?`,
      [
        updatedFields.firstname || null,
        updatedFields.lastname || null,
        updatedFields.password || null,
        id,
      ],
      function (err) {
        if (err) {
          console.error("Error updating user info:", err);
          return res.status(500).send({ message: "Server error" });
        } else {
          const updatedUser = {
            token,
            firstname: updatedFields.firstname || user[0].firstname,
            lastname: updatedFields.lastname || user[0].lastname,
            email: user[0].email,
            role: user[0].role,
          };

          res.status(200).send({
            user: updatedUser,
            message: "User info updated successfully",
          });
        }
      }
    );
  } catch (err) {
    console.error("daj error vise: !", err);
    res.status(500).send({ message: "Server error" });
  }
}

async function reserveTable(req) {
  const {
    restaurant_id,
    user_id,
    table_id,
    termin_id,
    day,
    month,
    year,
    email,
    start_time,
    end_time,
    name,
  } = req.body;
  console.log(
    "restaurant_id, user_id, table_id, termin_id: ",
    restaurant_id,
    user_id,
    table_id,
    termin_id,
    day,
    month,
    year,
    email,
    start_time,
    end_time,
    name
  );
  const sql =
    "INSERT INTO reservations (restaurant_id, user_id, table_id, termin_id, day, month, year, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  try {
    let reservation = await new Promise((resolve, reject) => {
      let rows = db.run(
        sql,
        [restaurant_id, user_id, table_id, termin_id, day, month, year, name],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              rows,
              email: email,
              start_time: start_time,
              end_time: end_time,
              day: day,
              month: month,
              year: year,
              name: name,
            });
          }
        }
      );
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
  console.log("restaurant_id, user_id, rate: ", restaurant_id, user_id, rate);
  const sql =
    "INSERT INTO restaurant_rating (restaurant_id, user_id, rate) VALUES (?, ?, ?)";

  try {
    let rating = await new Promise((resolve, reject) => {
      let rows = db.run(sql, [restaurant_id, user_id, rate], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            rows,
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

async function changeProfileImage(req) {
  const { image, user_id } = req.body;
  console.log("image: ", image, user_id);
  const sql = "UPDATE user SET image = ? WHERE id = ?";

  try {
    let userImage = await new Promise((resolve, reject) => {
      db.run(sql, [image, user_id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            image: image,
          });
        }
      });
    });
    console.log("Image updated successfully: ", userImage);
    return { userImage };
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
}

async function addToPending(req) {
  const {
    restaurant_id,
    user_id,
    table_id,
    termin_id,
    day,
    month,
    year,
    name,
    date_time,
  } = req.body;
  console.log(
    "restaurant_id, user_id, table_id, termin_id, day, month, year: ",
    restaurant_id,
    user_id,
    table_id,
    termin_id,
    day,
    month,
    year,
    name,
    date_time
  );
  const sql =
    "INSERT INTO pending (restaurant_id, user_id, table_id, termin_id, day, month, year, name, date_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  try {
    let reservation = await new Promise((resolve, reject) => {
      let rows = db.run(
        sql,
        [
          restaurant_id,
          user_id,
          table_id,
          termin_id,
          day,
          month,
          year,
          name,
          date_time,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              rows,
            });
          }
        }
      );
    });
    console.log("Table added to pening successfully: ", reservation);
    return { reservation };
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
}

async function addDescription(req) {
  const { restaurant_id, description } = req.body;
  console.log("restaurant_id, description: ", restaurant_id, description);
  const sql =
    "INSERT INTO restaurant_info (restaurant_id, description) VALUES (?, ?)";

  try {
    let restaurant_info = await new Promise((resolve, reject) => {
      let rows = db.run(sql, [restaurant_id, description], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            rows,
          });
        }
      });
    });
    console.log("Restaurant info added successfully: ", restaurant_info);
    return { restaurant_info };
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
}

async function makeReview(req) {
  const { restaurant_id, user_id, review, rate, image, time, review_id } =
    req.body;
  console.log(
    "restaurant_id, review: ",
    restaurant_id,
    user_id,
    review,
    rate,
    review_id, image
  );

  let sql = `UPDATE restaurant_rating SET 
        rate = COALESCE(?, rate),
        review = COALESCE(?, review),
        images = COALESCE (?, images),
        date_time = ?
        WHERE restaurant_id = ? AND user_id = ? AND id = ?
        `;

  try {
    let restaurant_info = await new Promise((resolve, reject) => {
      let rows = db.run(
        sql,
        [
          rate || null,
          review || null,
          image || null,
          time,
          restaurant_id,
          user_id,
          review_id,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              rows,
            });
          }
        }
      );
    });
    console.log("Restaurant review added successfully: ", restaurant_info);
    return { restaurant_info };
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
}

async function makeReview2(req) {
  const { restaurant_id, user_id, review, rate, image, time } = req.body;
  console.log("restaurant_id, review: ", restaurant_id, user_id, review, rate);

  let sql;
  sql = `INSERT INTO restaurant_rating (restaurant_id, user_id, rate, review, images, date_time) VALUES (?, ?, ?, ?, ?, ?)`;

  try {
    let restaurant_review = await new Promise((resolve, reject) => {
      let rows = db.run(
        sql,
        [restaurant_id, user_id, rate, review, image, time],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              rows,
            });
          }
        }
      );
    });
    console.log("Restaurant info added successfully: ", restaurant_review);
    return { restaurant_review };
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
}

async function addGallery(req) {
  const { id, images } = req.body;
  console.log("restaurant_id, images: ", id);



  try {
    let gallery = await getRestaurantGallery(id)
    
    if(gallery.length == 0) {
      let sql = `INSERT INTO restaurant_gallery (restaurant_id, image) VALUES (?, ?)`;

      try {
        await db.run(sql, [id, images]);
        console.log("Image inserted successfully");
      } catch (err) {
        console.log(err);
        throw new Error("Something went wrong!");
      }

      

    } else {
      let sql = `UPDATE restaurant_gallery SET image = ? WHERE restaurant_id = ?`
      console.log("usao sam u else")
      let restaurant_gallery = await new Promise((resolve, reject) => {
        let rows = db.run(
          sql,
          [
            images,
            id,
          ],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({
                rows,
              });
            }
          }
        );
      });
    }


      console.log("Restaurant info added successfully: ");
     

     console.log("daj mi gallery lenth: ", gallery.length)
      /* return { restaurant_review }; */
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
}

module.exports = {
  createTable,
  createTermin,
  renameTable,
  editUser,
  reserveTable,
  rateRestaurant,
  changeProfileImage,
  addToPending,
  addDescription,
  makeReview,
  makeReview2,
  addGallery,
};
