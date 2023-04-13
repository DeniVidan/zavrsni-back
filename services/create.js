var sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const db = new sqlite3.Database("mydb.db");

function createUserTable() {
  //console.log("kreiram tablicu user");
  db.run(
    `
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`,
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("User table created successfully!");
      }
    }
  );
}

module.exports = createUserTable;
