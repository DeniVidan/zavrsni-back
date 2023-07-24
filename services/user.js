var sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.db");
const {
  register,
  registerAdmin,
  login,
  makeVerifyCode,
  verifyCode,
} = require("../auth/auth");
const {
  getRestaurantTables,
  getRestaurantTermins,
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
} = require("../services/select");
const {
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
} = require("../services/insert");
const {
  deleteTermin,
  deleteTable,
  deletePending,
  deleteReservation,
  deleteExistingReservation,
  deleteCode,
  deleteReview,
} = require("../services/delete");

require("dotenv").config();
const nodemailer = require("nodemailer");

exports.addUser = function () {
  return async function (req, res) {
    //console.log("u user.js sam")
    try {
      let result = await register(req);
      //console.log("result: ", result)
      res.send({ result, msg: "User successfully created" });
      console.log("cigic: ", result.user.email);
      if (result.user.email) {
        let res = await makeVerifyCode(req, result.user.email);

        console.log("res za code: ", res);
      }
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Email is already in use!" });
    }
  };
};

exports.addAdmin = function () {
  return async function (req, res) {
    //console.log("u user.js sam")
    try {
      let result = await registerAdmin(req);
      //console.log("result: ", result)
      res.send({ result, msg: "User successfully logged in" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Email is already in use!" });
    }
  };
};

exports.authUser = function () {
  return async function (req, res) {
    try {
      let result = await login(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "User successfully logged" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Email and password do not match" });
    }
  };
};

exports.getUser = function () {
  return async (req, res) => {
    //console.log("dohvati usere");
    try {
      const rows = await new Promise((resolve, reject) => {
        db.all("SELECT * FROM user", [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      console.log(rows);
      res.send(rows);
    } catch (err) {
      console.error(err.message);
      res.json({ err: "Something went wrong!" });
    }
  };
};

exports.getRestaurantTables = function () {
  return async function (req, res) {
    try {
      let result = await getRestaurantTables(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Restaurant tables retrieved" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Restaurant tables error" });
    }
  };
};

exports.getRestaurantTermins = function () {
  return async function (req, res) {
    try {
      let result = await getRestaurantTermins(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Restaurant termins retrieved" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Restaurant termins error" });
    }
  };
};

exports.createTable = function () {
  return async function (req, res) {
    try {
      let result = await createTable(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Restaurant tables created" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Restaurant tables can't create error" });
    }
  };
};

exports.createTermin = function () {
  return async function (req, res) {
    try {
      let result = await createTermin(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Restaurant termin created" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Restaurant termin can't create error" });
    }
  };
};

exports.renameTable = function () {
  return async function (req, res) {
    try {
      let result = await renameTable(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Tables renamed successfully!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Restaurant table can't rename error" });
    }
  };
};

exports.deleteTermin = function () {
  return async function (req, res) {
    try {
      let result = await deleteTermin(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Termin deleted successfully!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Restaurant termin can't be deleted error" });
    }
  };
};

exports.deleteTable = function () {
  return async function (req, res) {
    try {
      let result = await deleteTable(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Table deleted successfully!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Restaurant table can't be deleted error" });
    }
  };
};
exports.editUser = function () {
  return async function (req, res) {
    try {
      let result = await editUser(req, res);
      //console.log("result: ", result)
      //res.status(200).send({ result, msg: "USer updated successfully!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "User can't update error" });
    }
  };
};

exports.getRestaurants = function () {
  return async function (req, res) {
    try {
      let result = await getRestaurants();
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Restaurants get successfully!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Restaurants can't get error" });
    }
  };
};
exports.getRestaurant = function () {
  return async function (req, res) {
    try {
      let result = await getRestaurant(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Restaurants get successfully!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Restaurants can't get error" });
    }
  };
};

exports.getAllTablesAndReservations = function () {
  return async function (req, res) {
    try {
      let result = await getAllTablesAndReservations(req);
      //console.log("result: ", result)
      res.status(200).send({
        result,
        msg: "Restaurant all tables and reservations retrieved",
      });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Reservations error" });
    }
  };
};

exports.groupTables = function () {
  return async function (req, res) {
    try {
      let result = await groupTables(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Grouped tables retrieved" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "group table error" });
    }
  };
};

exports.reserveTable = function () {
  return async function (req, res) {
    try {
      let result = await reserveTable(req);
      console.log("result: ", result)
      res.status(200).send({ result, msg: "Table reserved successfully!" });
      console.log("EMAIL: ", result.reservation.email);
      if(result.reservation.user_id == result.reservation.restaurant_id) {
        console.log("ISTO JE!")
      } else {
        let transporter = nodemailer.createTransport({
          host: "smtp.zoho.eu",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL, // your email address
            pass: process.env.PASSWORD, // your email password
          },
        });
        let date = `${result.reservation.month}/${result.reservation.day}/${result.reservation.year}`;
        let start_time = result.reservation.start_time;
        let end_time = result.reservation.end_time;
        let mailOptions = {
          from: `"Deni" <${process.env.EMAIL}>`, // sender address
          to: result.reservation.email, // list of receivers
          subject: "Reservation accepted ✓", // Subject line
          text: `Thank you ${result.reservation.name} for choosing our restaurant, your reservation has been accepted, looking forward to see you at ${date} from ${start_time} to ${end_time}`, // plain text body
          html: `Thank you <b>${result.reservation.name}</b> for choosing our restaurant, your reservation has been accepted, looking forward to see you at <b>${date}</b> from <b>${start_time}</b> to <b>${end_time}</b> `, // html body
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
          // Preview only available when sending through an Ethereal account
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        });
      }

    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Restaurant table can't reserve error" });
    }
  };
};

exports.getAllRestaurantsReservations = function () {
  return async function (req, res) {
    try {
      let result = await getAllRestaurantsReservations(req);
      //console.log("result: ", result)
      res
        .status(200)
        .send({ result, msg: "Restaurant all reservations retrieved" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Reservations error" });
    }
  };
};

exports.rateRestaurant = function () {
  return async function (req, res) {
    try {
      let result = await rateRestaurant(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Restaurant ratings posted" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Reservations error" });
    }
  };
};

exports.getRestaurantRating = function () {
  return async function (req, res) {
    try {
      let result = await getRestaurantRating(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Restaurant ratings retrieved" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Reservations error" });
    }
  };
};

exports.getUserRestaurantRating = function () {
  return async function (req, res) {
    try {
      let result = await getUserRestaurantRating(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Restaurant ratings retrieved" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Reservations error" });
    }
  };
};

exports.getUserRate = function () {
  return async function (req, res) {
    try {
      let result = await getUserRate(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Restaurant ratings retrieved" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Reservations error" });
    }
  };
};

exports.changeProfileImage = function () {
  return async function (req, res) {
    try {
      let result = await changeProfileImage(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Image changed successfully!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Cant change user image error" });
    }
  };
};

exports.getProfileImage = function () {
  return async function (req, res) {
    try {
      let result = await getProfileImage(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Image get successfull!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Cant get user image error" });
    }
  };
};

exports.addToPending = function () {
  return async function (req, res) {
    try {
      let result = await addToPending(req);
      //console.log("result: ", result)
      res
        .status(200)
        .send({ result, msg: "added table to pening successfull!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Cant add table to pending error" });
    }
  };
};

exports.getPending = function () {
  return async function (req, res) {
    try {
      let result = await getPending(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Get pending successfull!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Cant get penfing error" });
    }
  };
};

exports.deletePending = function () {
  return async function (req, res) {
    try {
      let result = await deletePending(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Delete pending successfull!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Cant delete penfing error" });
    }
  };
};

exports.deleteReview = function () {
  return async function (req, res) {
    try {
      let result = await deleteReview(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Delete review successfull!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Cant delete review error" });
    }
  };
};

exports.getUserReservations = function () {
  return async function (req, res) {
    try {
      let result = await getUserReservations(req);
      //console.log("result: ", result)
      res
        .status(200)
        .send({ result, msg: "Get user reservations successfull!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Cant get user reservations error" });
    }
  };
};

exports.deleteReservation = function () {
  return async function (req, res) {
    try {
      let result = await deleteReservation(req);
      //console.log("result: ", result)
      
      res.status(200).send({ result, msg: "Delete reservation successfull!" });
     
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Cant delete user reservation error" });
    }
  };
};

exports.deleteExistingReservation = function () {
  return async function (req, res) {
    try {
      let result = await deleteExistingReservation(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Delete reservation successfull!" });
      console.log("REZULT ZA DELETE REZERVACION: ", result)
      if(result.user_id == result.restaurant_id) {
        console.log("NE TREBA SLATI MAIL")
      } else {
        let transporter = nodemailer.createTransport({
          host: "smtp.zoho.eu",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL, // your email address
            pass: process.env.PASSWORD, // your email password
          },
        });
        let mailOptions = {
          from: `"Deni" <${process.env.EMAIL}>`, // sender address
          to: result.email, // list of receivers
          subject: "Reservation canceled X", // Subject line
          text: `We sincerely apologize, ${result.firstname}, but we regret to inform you that the reservation you made has been canceled due to inclement weather or other unforeseen circumstances.`, // plain text body
          html: `We sincerely apologize, ${result.firstname}, but we regret to inform you that the reservation you made has been canceled due to inclement weather or other unforeseen circumstances.`, // html body
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
          // Preview only available when sending through an Ethereal account
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        });
      }
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Cant delete user reservation error" });
    }
  };
};

exports.addDescription = function () {
  return async function (req, res) {
    try {
      let result = await addDescription(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Descrition added successfull!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Cant add description error" });
    }
  };
};

exports.getDescription = function () {
  return async function (req, res) {
    try {
      let result = await getDescription(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Descrition get successfull!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Cant get description error" });
    }
  };
};

exports.verifyCode = function () {
  return async function (req, res) {
    try {
      let result = await verifyCode(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "verify code successfull!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Cant verify code error" });
    }
  };
};


exports.deleteCode = function () {
  return async function (req, res) {
    try {
      let result = await deleteCode(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Verify code deleted successfully!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Verify code can't be deleted error" });
    }
  };
};

exports.getAllReviews = function () {
  return async function (req, res) {
    try {
      let result = await getAllReviews(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Reviews get successfull!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Reviews can't get error" });
    }
  };
};


exports.makeReview = function () {
  return async function (req, res) {
    try {
      let result = await makeReview(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Review posted successfull!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Review can't post error" });
    }
  };
};

exports.makeReview2 = function () {
  return async function (req, res) {
    try {
      let result = await makeReview2(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Review posted successfull!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Review can't post error" });
    }
  };
};


exports.getAllRestaurantsImages = function () {
  return async function (req, res) {
    try {
      let result = await getAllRestaurantsImages(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Restaurant images get successfull!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Can't get restaurant images error" });
    }
  };
};

exports.getGallery = function () {
  return async function (req, res) {
    try {
      let result = await getGallery(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Gallery images get successfull!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Can't get gallery images error" });
    }
  };
};

exports.addGallery = function () {
  return async function (req, res) {
    try {
      let result = await addGallery(req);
      //console.log("result: ", result)
      res.status(200).send({ result, msg: "Gallery images added successfull!" });
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Can't add gallery images error" });
    }
  };
};
/* async function addUser(firstname, lastname, email, password) {} */

/* db.run(`INSERT INTO user (${fileds}, firstname, lastname, email, password) VALUES ('${values}', '${firstname}', '${lastname}', '${email}', '${password}')`); */

/*     const sql = `SELECT * FROM user`

    try {
        const db = await connectDatabase()
        const rows = await db.get(sql, []);
        console.log(rows)
        db.close();
        return res.status(200).json(rows || {});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }

    db.all(sql, [], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
          console.log(row.firstname);
        });
    }); */

/* function get() {
    return async (req, res) => {
        
        const sql = `SELECT * FROM user`
        try {
            const db = await connectDatabase()
            const rows = await db.get(sql, []);
            console.log(rows)
            db.close();
            return res.status(200).json(rows || {});
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    };
};
 */

/* module.exports = addUser, getUser; */
