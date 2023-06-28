const express = require("express");
const router = express.Router();
const user = require("../services/user"); 
 
var sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.db");
const createUserTable = require("../services/create");
const { verify } = require("../auth/auth")



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

router.get("/user/restaurant/rating", [verify], user.getUserRestaurantRating());

router.get("/proba"), [verify], user.getUserRate()

router.put("/change/profile/image", [verify], user.changeProfileImage());

router.get("/get/profile/image", [verify], user.getProfileImage());

router.get("/get/pending", [verify], user.getPending());

router.post("/add/pending", [verify], user.addToPending());

router.delete("/delete/pending", [verify], user.deletePending());

router.get("/get/user/reservations", [verify], user.getUserReservations());

router.delete("/delete/reservation", [verify], user.deleteReservation());

router.delete("/delete/existing/reservation", [verify], user.deleteExistingReservation());

router.post("/add/description", [verify], user.addDescription());

router.get("/get/description", [verify], user.getDescription());

router.post("/verify/code", [verify], user.verifyCode());

router.delete("/delete/verify/code", [verify], user.deleteCode());

router.get("/reviews", [verify], user.getAllReviews());

router.post("/make/review", [verify], user.makeReview());

router.get("/restaurant/images", [verify], user.getAllRestaurantsImages());


module.exports = router;
