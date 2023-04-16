const createUserTable = require("../services/create");
const connectDatabase = require("../services/database");
var sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.db");
import bcrypt from "bcrypt";
const { register, login } = require("../auth/auth")

exports.addUser = function () {
  return async function (req, res) {
    //console.log("u user.js sam")
    try {
      let result = await register(req)
      console.log("result: ", result)
      res.send({result, msg: "User successfully created"});
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
      console.log("result: ", result)
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
    console.log("dohvati usere");
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
