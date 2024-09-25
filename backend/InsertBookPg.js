const { Pool } = require("pg"); // PostgreSQL client
const pool = new Pool({
  user: "postgres", // default PostgreSQL user
  host: "localhost", // default host
  database: "pustakalya", // default database
  password: "1", // your password
  port: 5432, // default PostgreSQL port
});
const express = require("express");
const app = new express();
app.use(express.json());
const router = express.Router();

// Endpoint to insert book details into the PostgreSQL database
router.post("/insertBook", (req, res) => {
  const { book_id, name, price, description } = req.body;

  const insertQuery = `
    INSERT INTO books (book_id, name, description, price)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  pool
    .query(insertQuery, [book_id, name, description, price])
    .then((result) => {
      res.json({ message: "Book inserted successfully", book: result.rows[0] });
    })
    .catch((err) => {
      console.error("Error inserting book:", err);
      res.status(500).json({ error: "Database insertion failed" });
    });
});
module.exports = router;
