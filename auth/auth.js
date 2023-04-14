var sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.db");
import bcrypt from "bcrypt";
var jwt = require("jsonwebtoken");
require("dotenv").config();

async function register(req) {
  const { firstname, lastname, email, password } = req.body;
  const password_hash = await bcrypt.hash(password, 8);
  const sql =
    "INSERT INTO user (firstname, lastname, email, password) VALUES (?, ?, ?, ?)";

  try {
    let user = await new Promise((resolve, reject) => {
      db.run(sql, [firstname, lastname, email, password_hash], function (err) {
        if (err) {
          reject(err);
        } else {
          const token = jwt.sign({ email }, process.env.JWT_SECRET, {
            algorithm: "HS512",
            expiresIn: "1 week",
          });
          resolve({ token, email: email });
        }
      });
    });
    console.log("User registered successfully: ", email);
    return { user };
  } catch (error) {
    console.error(error.message);
    throw new Error("Email already in use");
  }
}

async function login(req) {
  const { email, password } = req.body;
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(`SELECT * FROM user WHERE email = ?`, [email], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    console.log("daj mi row: ", rows);
    if (rows.length > 0) {
      const passwordMatch = await bcrypt.compare(password, rows[0].password);
      if (passwordMatch) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET);
        return {
          email,
          token,
        };
      } else {
        throw new Error("Invalid email or password!");
      }
    } else {
      throw new Error("Invalid email or password!");
    }
  } catch (err) {
    throw new Error("Something went wrong!");
  }
}

async function verify(req, res, next) {
  try {
    let authorization = req.headers.authorization.split(" ");
    let type = authorization[0];
    let token = authorization[1];
    //console.log(token);
    if (type !== "Bearer") {
      return res.status(401).send({error: "Cant authorize"});
    } else {
      req.jwt = jwt.verify(token, process.env.JWT_SECRET);
      return next();
    }
  } catch (error) {
    return res.status(401).send({error: "Cant authorize"});
  }
}

module.exports = { register, login, verify };
