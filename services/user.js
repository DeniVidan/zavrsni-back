const connectDatabase = require("../services/database");
var sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.db");
const createUserTable = require("../services/create");
import bcrypt from "bcrypt";

exports.addUser = function () {
  return async function (req, res) {
    //console.log("u user.js sam")
    const { firstname, lastname, email, password } = req.body;
    const password_hash = await bcrypt.hash(password, 8)
    const sql =
      "INSERT INTO user (firstname, lastname, email, password) VALUES (?, ?, ?, ?)";
    try {
      await new Promise((resolve, reject) => {
        
        db.run(sql, [firstname, lastname, email, password_hash], function (err) {
          if (err) reject(err);
          else {
            resolve(this.lastID);
            return {
                email,
            }
          }
        });
      });
      res.send("User added successfully!");
    } catch (err) {
      console.error(err.message);
      // ovako ne šalje message
      res.status(500).json({ err: "Email is already in use!" });
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

exports.authUser = function () {
  return async (req, res) => {
    const { email, password } = req.body;
    try {
      const rows = await new Promise((resolve, reject) => {
        db.all(`SELECT * FROM user WHERE email = ?`, [email], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      console.log("daj mi row: ", rows.length);
      if (rows.length > 0 && rows[0].password === password) {
        res.status(200).send("User logged in successfully!");
      } else {
        res.status(500).json({ err: "Invalid email or password!" });
      }
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
