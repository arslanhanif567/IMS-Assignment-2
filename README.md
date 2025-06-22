# IMS (Internship Management System)

A full-stack web application for managing internships and applications between companies and students.

## Project Structure

```
IMS-Assignment-2/
├── Backend/           # Node.js/Express API server
├── Frontend/          # Static HTML/CSS/JS frontend
├── mysql-9.3.0-winx64/ # MySQL installation (Windows)
└── database_schema.sql # Database structure
```

## Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (v8.0 or higher)
- **Git** (for cloning the repository)

## Setup Instructions

### 1. Database Setup

#### Option A: Using the included MySQL installation (Windows)
1. Navigate to `mysql-9.3.0-winx64/bin/`
2. Open Command Prompt as Administrator
3. Start MySQL server:
   ```bash
   mysqld --console --port=3307
   ```
4. In a new terminal, connect to MySQL:
   ```bash
   mysql -u root -p
   ```
   - Enter password: `Password123`

#### Option B: Using your own MySQL installation
1. Install MySQL on your system
2. Start MySQL service
3. Connect to MySQL as root user

#### Create Database and Tables
1. Create the database:
   ```sql
   CREATE DATABASE internconnect;
   USE internconnect;
   ```

2. Import the schema:
   ```bash
   mysql -u root -p internconnect < Backend/database_schema.sql
   ```

### 2. Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure database connection (if needed):
   - Edit `Backend/db.js` to match your MySQL credentials
   - Default settings:
     - Host: `localhost`
     - User: `root`
     - Password: `Password123`
     - Database: `internconnect`

4. Start the backend server:
   ```bash
   node server.js
   ```
   
   The server will start on `http://localhost:3000`

### 3. Frontend Setup

#### Option A: Using Node.js http-server
1. Install http-server globally (if not already installed):
   ```bash
   npm install -g http-server
   ```

2. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

3. Start the frontend server:
   ```bash
   http-server -p 8081
   ```

#### Option B: Using Python (if available)
1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Start Python server:
   ```bash
   # Python 3
   python -m http.server 8081
   
   # Python 2
   python -m SimpleHTTPServer 8081
   ```

#### Option C: Using Live Server (VS Code extension)
1. Open the Frontend folder in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Running the Application

### 1. Start Database
- Ensure MySQL is running on port 3307 (or your configured port)

### 2. Start Backend
```bash
cd Backend
node server.js
```
- Server will be available at: `http://localhost:3000`
- API endpoints will be accessible at: `http://localhost:3000/api/...`

### 3. Start Frontend
```bash
cd Frontend
http-server -p 8081
```
- Frontend will be available at: `http://localhost:8081`

## Application Features

### Admin Features
- **Sign up/Login**: Register as a company admin
- **Create Internships**: Post new internship opportunities
- **Manage Applications**: View and process student applications
- **Download Resumes**: Access uploaded student resumes

### Student Features
- **Sign up/Login**: Register as a student
- **Browse Internships**: View available internship opportunities
- **Apply for Internships**: Submit applications with resume upload
- **Track Applications**: Monitor application status

## API Endpoints

### Authentication
- `POST /api/admin/signup` - Admin registration
- `POST /api/admin/login` - Admin login
- `POST /api/student/signup` - Student registration
- `POST /api/student/login` - Student login

### Internships
- `GET /api/internships` - Get all internships
- `POST /api/internships` - Create new internship (Admin only)
- `DELETE /api/internships/:id` - Delete internship (Admin only)

### Applications
- `POST /api/applications` - Submit application (Student only)
- `GET /api/applications` - Get applications (Admin only)
- `GET /api/applications/:id/resume` - Download resume

## Database Schema

The application uses 4 main tables:
- **admins**: Company administrators
- **students**: Student users
- **internships**: Internship postings
- **applications**: Student applications

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check credentials in `Backend/db.js`
   - Ensure database `internconnect` exists

2. **Port Already in Use**
   - Change port numbers in server configuration
   - Kill processes using the ports

3. **CORS Errors**
   - Backend is configured to allow requests from `http://localhost:8081`
   - Update CORS settings in `Backend/server.js` if using different ports

4. **File Upload Issues**
   - Ensure `Backend/uploads/` directory exists
   - Check file permissions

### Ports Used
- **Backend**: 3000
- **Frontend**: 8081
- **MySQL**: 3307

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens are used for session management
- File uploads are restricted to specific file types
- CORS is configured for security

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. 