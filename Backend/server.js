const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // your MySQL password
  database: 'internconnect'
});

db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL.');
  }
});

app.post('/api/auth/admin/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required." });

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Email may already exist or database error." });
    }
    res.status(201).json({ message: "Admin registered successfully." });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
