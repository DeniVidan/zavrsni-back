var sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.db");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");

async function makeVerifyCode(req, email) {
  // const {  } = req.body;
  //code generation
  async function generateRandomString(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
  }
  const code = await generateRandomString(7);
  const result_hash = await bcrypt.hash(code, 8)

  const getUserSQL = "SELECT * FROM user WHERE user.email = ?";
  try {
    let getEmail = await new Promise((resolve, reject) => {
      db.run(getUserSQL, [email], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(getEmail);
        }
      });
    });
    console.log("user email get successfully: ", getEmail);
  } catch (error) {
    console.error(error.message);
    throw new Error("Email cant get email");
  }

  const sql = "INSERT INTO verify (email, code) VALUES (?, ?)";

  try {
    let verify = await new Promise((resolve, reject) => {
      db.run(sql, [email, result_hash], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            email: email,
            code: code,
          });
        }
      });
    });


    console.log("EMAIL: ", email);
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
      to: email, // list of receivers
      subject: "Account verification", // Subject line
      text: `Code for verifing ${email} e-mail adress is ${code} Thank you for choosing us!`, // plain text body
      html: `Code for verifing <b>${email}</b> e-mail adress is <b style="font-size:20px">${code}</b> <br><br> Thank you for choosing us!`, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });


    console.log("User registered successfully: ", email);
    return { verify };
  } catch (error) {
    console.error(error.message);
    throw new Error("Email already in use");
  }
}

async function verifyCode(req) {
  const { email, input_code } = req.body;
  console.log("user_id, code: ", email, input_code)


  try {
    const rows = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM verify WHERE verify.email = ?", [email], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    console.log("verify: ", rows);
    const codeMatch = await bcrypt.compare(input_code, rows[0].code);
    if(codeMatch){
      const updateVerify = await new Promise((resolve, reject) => {
        db.all("UPDATE user SET verified = 1 WHERE user.email = ?", [email], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }); 
      });
      console.log("yesss!!: ", updateVerify)

      return {
        msg: "successfully verified",
        status: 200
      }
    } else{
      console.log("Noooo!!!")
      return {
        msg: "Code doesn't match",
        status: 500
      }
    }

    //return rows;
  } catch (err) {
    console.error(err.message);
    throw new Error("Cannot verify email");
  }

  //const sql = "INSERT INTO verify (email, code) VALUES (?, ?)";

/*   try {
    let verify = await new Promise((resolve, reject) => {
      db.run(sql, [email, code], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            email: email,
            code: code,
          });
        }
      });
    });
    console.log("User registered successfully: ", email);
    return { verify };
  } catch (error) {
    console.error(error.message);
    throw new Error("Email already in use");
  } */
}

async function register(req) {
  const { firstname, lastname, email, role, password } = req.body;
  const password_hash = await bcrypt.hash(password, 8);
  const sql =
    "INSERT INTO user (firstname, lastname, email, role, password) VALUES (?, ?, ?, ?, ?)";

  try {
    let user = await new Promise((resolve, reject) => {
      db.run(
        sql,
        [firstname, lastname, email, role, password_hash],
        function (err) {
          if (err) {
            reject(err);
          } else {
            const userId = this.lastID; // Retrieve the auto-incremented user ID
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
              algorithm: "HS512",
              expiresIn: "1 week",
            });
            resolve({
              id: userId, // Add the user ID to the resolved object
              token,
              firstname: firstname,
              lastname: lastname,
              email: email,
              role: role,
              verified: 0,
            });
          }
        }
      );
    });
    console.log("User registered successfully: ", email);
    return { user };
  } catch (error) {
    console.error(error.message);
    throw new Error("Email already in use");
  }
}

async function registerAdmin(req) {
  const {
    firstname,
    lastname,
    email,
    restaurant_name,
    location,
    role,
    password,
  } = req.body;
  const password_hash = await bcrypt.hash(password, 8);
  const sql =
    "INSERT INTO user (firstname, lastname, email, restaurant_name, location, role, password) VALUES (?, ?, ?, ?, ?, ?, ?)";

  try {
    let user = await new Promise((resolve, reject) => {
      db.run(
        sql,
        [
          firstname,
          lastname,
          email,
          restaurant_name,
          location,
          role,
          password_hash,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            const userId = this.lastID;
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
              algorithm: "HS512",
              expiresIn: "1 week",
            });

            resolve({
              id: userId,
              token,
              firstname: firstname,
              lastname: lastname,
              email: email,
              role: role,
              verified: 0,
            });
          }
        }
      );
    });
    console.log("User registered successfully: ", user);
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
      //console.log(passwordMatch)
      if (passwordMatch) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
          algorithm: "HS512",
          expiresIn: "1 week",
        });
        return {
          token,
          id: rows[0].id,
          firstname: rows[0].firstname,
          lastname: rows[0].lastname,
          email: rows[0].email,
          restaurant_name: rows[0].restaurant_name,
          location: rows[0].location,
          role: rows[0].role,
          verified: rows[0].verified,
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
      return res.status(401).send({ error: "Cant authorize" });
    } else {
      req.jwt = jwt.verify(token, process.env.JWT_SECRET);
      return next();
    }
  } catch (error) {
    return res.status(401).send({ error: "Cant authorize" });
  }
}

module.exports = {
  register,
  registerAdmin,
  login,
  verify,
  makeVerifyCode,
  verifyCode,
};
