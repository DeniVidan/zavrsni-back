const express = require("express");
const router = express.Router();
/* const addUser = require("../services/user");*/
const user = require("../services/user"); 
 
/* const connectDatabase = require("../services/database") */
var sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.db");
const createUserTable = require("../services/create");
const { verify } = require("../auth/auth")

/* createUserTable() */

router.get("/", (req, res) => res.send("cao iz routera"));
router.get("/a", (req, res) => res.send("cao na drugoj ruti"));

router.get("/users", [verify], user.getUser());

router.post("/add/user", user.addUser());

router.post("/add/admin", user.addAdmin());

router.post("/auth/user", user.authUser());

router.get("/restaurant/tables", [verify], user.getRestaurantTables())

router.get("/restaurant/termins", [verify], user.getRestaurantTermins())

router.post("/create/tables", [verify], user.createTable());

router.post("/create/termin", [verify], user.createTermin());
    
router.put("/rename/tables", [verify], user.renameTable());

router.delete("/delete/termin", [verify], user.deleteTermin());

router.delete("/delete/table", [verify], user.deleteTable());

router.put("/edit/user", [verify], user.editUser());

router.get("/restaurants", [verify], user.getRestaurants());

router.get("/restaurant", [verify], user.getRestaurant());

router.get("/restaurant/reservations", [verify], user.getAllTablesAndReservations());

router.get("/group/tables", [verify], user.groupTables());

router.post("/make/reservation", [verify], user.reserveTable());

router.get("/reservations", [verify], user.getAllRestaurantsReservations());

router.post("/rate", [verify], user.rateRestaurant());

router.get("/restaurant/rating", [verify], user.getRestaurantRating());

/*   const { firstname, lastname, email, password } = req.body;
  createUserTable();
  console.log("dodaj usera");
  const sql =
    "INSERT INTO user (firstname, lastname, email, password) VALUES (?, ?, ?, ?)";
  try {
    await new Promise((resolve, reject) => {
      db.run(sql, [firstname, lastname, email, password], function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
    res.send("User added successfully!");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err: "Email is already in use!" });
  } */


/*   const sql = 'INSERT INTO user (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
  db.run(sql, [firstname, lastname, email, password], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Something went wrong!");
    } else {
      res.send("User added successfully!");
    }
  }); */

/*     addUser(firstname, lastname, email, password) */
/* router.post("/addUser", (req, res) => {
    const {firstname, lastname, email, password} = req.body
    console.log(firstname, " ", lastname, " ", email, " ", password)

    user.get()

}) */

/* router.route("/addUser").get((req, res) => {
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
     const {firstname, lastname, email, password} = req.body
    console.log(firstname, " ", lastname, " ", email, " ", password) 

}) */
/* router.get('/addUsers', (req, res) => {

    console.log("daj mi log")
    db.all('SELECT * FROM user', [], (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Something went wrong!');
      } else {
        console.log(rows);
        res.json(rows);
      }
    });
  });
  router.get('/user', (req, res) => {

    console.log("daj mi log")
    db.all('SELECT * FROM user', [], (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Something went wrong!');
      } else {
        console.log(rows);
        res.json(rows);
      }
    });
  }); */

module.exports = router;
