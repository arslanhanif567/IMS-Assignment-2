const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: 'Password123', // Using the new password set by the user
  database: 'internconnect'
});

db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL.');
  }
});

const JWT_SECRET = 'your-very-secret-key-that-is-long-and-secure'; // Replace with a real secret key

const UPLOAD_DIR = 'uploads/resumes';
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to verify token and identify user
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token is required.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Adds user info (id, role) to the request object
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

// Admin Signup
app.post('/api/auth/admin/signup', async (req, res) => {
  const { companyName, email, password } = req.body;

  if (!companyName || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO admins (companyName, email, password) VALUES (?, ?, ?)";
    db.query(sql, [companyName, email, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Email may already exist or database error." });
      }
      res.status(201).json({ message: "Admin registered successfully." });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during signup.' });
  }
});

// Admin Login
app.post('/api/auth/admin/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password.' });
    }

    const sql = 'SELECT * FROM admins WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const admin = results[0];
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: admin.id, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: admin.id, email: admin.email, role: 'admin' } });
    });
});


// Student Signup
app.post('/api/auth/student/signup', async (req, res) => {
    const { fullName, email, university, major, phoneNumber, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ error: 'Full Name, Email, and Password are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO students (fullName, email, university, major, phoneNumber, password) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [fullName, email, university, major, phoneNumber, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Email may already exist or database error.' });
            }
            res.status(201).json({ message: 'Student registered successfully.' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error during signup.' });
    }
});


// Student Login
app.post('/api/auth/student/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password.' });
    }

    const sql = 'SELECT * FROM students WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const student = results[0];
        const isMatch = await bcrypt.compare(password, student.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: student.id, role: 'student' }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: student.id, email: student.email, role: 'student' } });
    });
});


// -- INTERNSHIPS API --

// POST a new internship (Admin only)
app.post('/api/internships', authenticate, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden. Only admins can post internships.' });
    }

    const { title, companyName, description, location, salary, startDate, endDate } = req.body;
    if (!title || !companyName) {
        return res.status(400).json({ error: 'Title and Company Name are required.' });
    }

    const sql = 'INSERT INTO internships (title, companyName, description, location, salary, startDate, endDate, adminId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [title, companyName, description, location, salary, startDate, endDate, req.user.id], (err, result) => {
        if (err) {
            console.error('Error creating internship:', err);
            return res.status(500).json({ error: 'Database error while creating internship.' });
        }
        res.status(201).json({ message: 'Internship created successfully.', internshipId: result.insertId });
    });
});

// GET all internships (For both students and admins)
app.get('/api/internships', authenticate, (req, res) => {
    const sql = 'SELECT * FROM internships ORDER BY startDate DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching internships:', err);
            return res.status(500).json({ error: 'Database error while fetching internships.' });
        }
        res.json(results);
    });
});

// DELETE an internship (Admin only)
app.delete('/api/internships/:id', authenticate, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden. Only admins can delete internships.' });
    }

    const { id } = req.params;
    const sql = 'DELETE FROM internships WHERE id = ? AND adminId = ?';
    db.query(sql, [id, req.user.id], (err, result) => {
        if (err) {
            console.error('Error deleting internship:', err);
            return res.status(500).json({ error: 'Database error while deleting internship.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Internship not found or you do not have permission to delete it.' });
        }
        res.json({ message: 'Internship deleted successfully.' });
    });
});


// -- APPLICATIONS API --

// POST a new application (Student only)
app.post('/api/applications', authenticate, upload.single('resume'), (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Forbidden. Only students can apply.' });
    }

    const { internshipId } = req.body;
    if (!req.file) {
        return res.status(400).json({ error: 'Resume file is required.' });
    }

    const resumePath = req.file.path.replace(/\\\\/g, "/");
    const studentId = req.user.id;

    const sql = 'INSERT INTO applications (internshipId, studentId, resumePath) VALUES (?, ?, ?)';
    db.query(sql, [internshipId, studentId, resumePath], (err, result) => {
        if (err) {
            console.error('Error creating application:', err);
            return res.status(500).json({ error: 'Database error while creating application.' });
        }
        res.status(201).json({ message: 'Application submitted successfully.' });
    });
});

// GET all applications for a specific internship (Admin only)
app.get('/api/applications/:internshipId', authenticate, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden. Only admins can view applications.' });
    }
    
    const { internshipId } = req.params;
    
    // Also join with students table to get student details
    const sql = `
        SELECT a.*, s.fullName, s.email 
        FROM applications a 
        JOIN students s ON a.studentId = s.id 
        WHERE a.internshipId = ?
    `;

    db.query(sql, [internshipId], (err, results) => {
        if (err) {
            console.error('Error fetching applications:', err);
            return res.status(500).json({ error: 'Database error.' });
        }
        res.json(results);
    });
});

// GET all applications for all internships posted by an admin
app.get('/api/admin/applications', authenticate, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden.' });
    }

    const adminId = req.user.id;
    const sql = `
        SELECT a.id, a.status, a.resumePath, i.title AS internshipTitle, s.fullName AS studentName, s.email AS studentEmail
        FROM applications a
        JOIN internships i ON a.internshipId = i.id
        JOIN students s ON a.studentId = s.id
        WHERE i.adminId = ?
    `;

    db.query(sql, [adminId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error.' });
        }
        res.json(results);
    });
});

// PATCH to update application status (Admin only)
app.patch('/api/applications/:id', authenticate, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden. Only admins can update applications.' });
    }

    const { id } = req.params;
    const { status } = req.body; // Expecting status to be 'Accepted' or 'Rejected'

    if (!status || !['Accepted', 'Rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status provided.' });
    }

    const sql = 'UPDATE applications SET status = ? WHERE id = ?';
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error('Error updating application status:', err);
            return res.status(500).json({ error: 'Database error while updating status.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Application not found.' });
        }
        res.json({ message: `Application status updated to ${status}.` });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
 