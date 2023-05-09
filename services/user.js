var sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.db");
const { register, registerAdmin, login } = require("../auth/auth")
const { getRestaurantTables, getRestaurantTermins, getRestaurants, getRestaurant, getAllTablesAndReservations, groupTables, getAllRestaurantsReservations, getRestaurantRating, getUserRestaurantRating, getUserRate, getProfileImage, getPending } = require("../services/select")
const { createTable, createTermin, renameTable, editUser, reserveTable, rateRestaurant, changeProfileImage, addToPending } = require("../services/insert")
const { deleteTermin, deleteTable, deletePending } = require("../services/delete")

exports.addUser = function () {
  return async function (req, res) {
    //console.log("u user.js sam")
    try {
      let result = await register(req)
      //console.log("result: ", result)
      res.send({result, msg: "User successfully created"});
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
      let result = await registerAdmin(req)
      //console.log("result: ", result)
      res.send({result, msg: "User successfully logged in"});
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
      let result = await login(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "User successfully logged"});
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
      let result = await getRestaurantTables(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Restaurant tables retrieved"});
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
      let result = await getRestaurantTermins(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Restaurant termins retrieved"});
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
      let result = await createTable(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Restaurant tables created"});
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
      let result = await createTermin(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Restaurant termin created"});
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
      let result = await renameTable(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Tables renamed successfully!"});
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
      let result = await deleteTermin(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Termin deleted successfully!"});
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
      let result = await deleteTable(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Table deleted successfully!"});
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
      let result = await editUser(req, res)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "USer updated successfully!"});
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
      let result = await getRestaurants()
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Restaurants get successfully!"});
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
      let result = await getRestaurant(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Restaurants get successfully!"});
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
      let result = await getAllTablesAndReservations(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Restaurant all tables and reservations retrieved"});
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
      let result = await groupTables(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Grouped tables retrieved"});
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
      let result = await reserveTable(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Table reserved successfully!"});
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
      let result = await getAllRestaurantsReservations(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Restaurant all reservations retrieved"});
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
      let result = await rateRestaurant(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Restaurant ratings posted"});
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
      let result = await getRestaurantRating(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Restaurant ratings retrieved"});
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
      let result = await getUserRestaurantRating(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Restaurant ratings retrieved"});
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
      let result = await getUserRate(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Restaurant ratings retrieved"});
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
      let result = await changeProfileImage(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Image changed successfully!"});
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
      let result = await getProfileImage(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Image get successfull!"});
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
      let result = await addToPending(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "added table to pening successfull!"});
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
      let result = await getPending(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "get pending successfull!"});
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
      let result = await deletePending(req)
      //console.log("result: ", result)
      res.status(200).send({result, msg: "Delete pending successfull!"});
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Cant delete penfing error" });
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
