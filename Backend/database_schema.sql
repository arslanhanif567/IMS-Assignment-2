CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `companyName` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS `students` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fullName` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `university` VARCHAR(255),
  `major` VARCHAR(255),
  `phoneNumber` VARCHAR(20),
  `password` VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS `internships` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `companyName` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `location` VARCHAR(255),
  `salary` VARCHAR(100),
  `startDate` DATE,
  `endDate` DATE,
  `adminId` INT,
  FOREIGN KEY (`adminId`) REFERENCES `admins`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `internshipId` INT,
  `studentId` INT,
  `resumePath` VARCHAR(255) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'Pending',
  `appliedDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`internshipId`) REFERENCES `internships`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE
); 