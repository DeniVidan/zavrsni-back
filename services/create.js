var sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mydb.db");

db.serialize(() => {
  //console.log("kreiram tablicu user");
  db.run(
    `
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      restaurant_name TEXT,
      location TEXT,
      role TEXT NOT NULL,
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

  //console.log("kreiram tablicu user");
  db.run(
    `
    CREATE TABLE IF NOT EXISTS tables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER NOT NULL,
      table_name TEXT NOT NULL,
      table_size INTEGER NOT NULL,
      FOREIGN KEY (restaurant_id) REFERENCES user(id)
    )
  `,
    (err) => {
      if (err) console.error(err.message);
      else console.log("Tables table created successfully!");
    }
  );


  db.run(
    `
    CREATE TABLE IF NOT EXISTS termin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      FOREIGN KEY (restaurant_id) REFERENCES user(id)
    )
  `,
    (err) => {
      if (err) console.error(err.message);
      else console.log("Termin table created successfully!");
    }
  );

  db.run(
    `
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      table_id INTEGER NOT NULL,
      termin_id INTEGER NOT NULL,
      day INTEGER NOT NULL,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      FOREIGN KEY (restaurant_id) REFERENCES user(id),
      FOREIGN KEY (user_id) REFERENCES user(id),
      FOREIGN KEY (table_id) REFERENCES tables(id),
      FOREIGN KEY (termin_id) REFERENCES termin(id)
    )
  `,
    (err) => {
      if (err) console.error(err.message);
      else console.log("Reservations table created successfully!");
    }
  );


  db.run(
    `
    CREATE TABLE IF NOT EXISTS restaurant_rating (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      rate REAL NOT NULL,
      FOREIGN KEY (restaurant_id) REFERENCES user(id),
      FOREIGN KEY (user_id) REFERENCES user(id)
    )
  `,
    (err) => {
      if (err) console.error(err.message);
      else console.log("Rating table created successfully!");
    }
  );
});



