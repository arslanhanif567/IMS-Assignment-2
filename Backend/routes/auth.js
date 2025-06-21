// routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

// POST: Student Signup
router.post('/student/signup', async (req, res) => {
  const { fullName, email, university, major, phone, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO students (full_name, email, university, major, phone, password)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [fullName, email, university, major, phone, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Student registered successfully' });
  });
});

// POST: Student Login
router.post('/student/login', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM students WHERE email = ?`;

  db.query(query, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    const isMatch = await bcrypt.compare(password, results[0].password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    // Normally you’d send a token. For now, send user data (excluding password)
    const { password: _, ...student } = results[0];
    res.json({ message: 'Login successful', student });
  });
});

module.exports = router;
