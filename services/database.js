var sqlite3 = require("sqlite3").verbose();
const { open } = require('sqlite');

/* db.run("CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, firstname TEXT, lastname TEXT, email TEXT UNIQUE, password TEXT)"); */
/* db.run("CREATE TABLE IF NOT EXISTS user ( _id INTEGER NOT NULL PRIMARY KEY, firstname TEXT NOT NULL, lastname TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL"); */

/* db.run("INSERT INTO mytable (name, age) VALUES ('John', 30)"); */

/* async function connectDatabase() {
    try {
        const db = await open({filename: "mydb.db", driver: sqlite3.Database});
        db.run('PRAGMA foreign_keys = ON;');
        console.log("Successfully connected to database")
        return db;
        
    } catch (error) {
        console.log(error)
    }
    }   */

/*       let sql = `SELECT * FROM user WHERE id = 1`
        
      db.all(sql, [], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
          console.log(row.firstname);
        });
      });
 */
      /* db.run() */
      
    



/* function addUser() {
    db.run("INSERT INTO user (firstname, lastname, email, password) VALUES ('Deni2', 'Vidan2', 'deni6@gmail.com', '123')");
} */

/* module.exports = connectDatabase(); */
