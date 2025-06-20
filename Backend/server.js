// backend/server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",         // change if your MySQL user is different
  password: "",         // change if you have a password set
  database: "internconnect"
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL!");
});

// SIGNUP
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  const sql = "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, password], (err, result) => {
    if (err) return res.status(500).json({ message: "Signup failed", error: err });
    res.json({ message: "Signup successful" });
  });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM admins WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: "Login error" });
    if (results.length > 0) {
      res.json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
