CREATE DATABASE jobportal;
USE jobportal;
CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Role VARCHAR(30) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE Employers (
    EmployerID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL,
    CompanyName VARCHAR(150) NOT NULL,
    CompanyDescription TEXT,
    Location VARCHAR(100),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
CREATE TABLE JobSeekers (
    SeekerID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL,
    FullName VARCHAR(150) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY AUTO_INCREMENT,
    CategoryName VARCHAR(100) NOT NULL UNIQUE
);
CREATE TABLE Companies (
    CompanyID INT PRIMARY KEY AUTO_INCREMENT,
    EmployerID INT NOT NULL,
    CategoryID INT,
    CompanyName VARCHAR(150) NOT NULL,
    Description TEXT,
    Location VARCHAR(100),
    Website VARCHAR(200),
    FOREIGN KEY (EmployerID) REFERENCES Employers(EmployerID),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);
CREATE TABLE Jobs (
    JobID INT PRIMARY KEY AUTO_INCREMENT,
    EmployerID INT NOT NULL,
    CategoryID INT,
    Title VARCHAR(150) NOT NULL,
    Description TEXT,
    Location VARCHAR(100),
    Salary DECIMAL(10,2),
    JobType VARCHAR(50),
    PostedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (EmployerID) REFERENCES Employers(EmployerID),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);
CREATE TABLE Resumes (
    ResumeID INT PRIMARY KEY AUTO_INCREMENT,
    SeekerID INT NOT NULL,
    FilePath VARCHAR(255),
    Skills TEXT,
    Education TEXT,
    Experience TEXT,
    FOREIGN KEY (SeekerID) REFERENCES JobSeekers(SeekerID)
);
CREATE TABLE Applications (
    ApplicationID INT PRIMARY KEY AUTO_INCREMENT,
    JobID INT NOT NULL,
    SeekerID INT NOT NULL,
    ResumeID INT,
    Status VARCHAR(50) DEFAULT 'Applied',
    AppliedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (JobID) REFERENCES Jobs(JobID),
    FOREIGN KEY (SeekerID) REFERENCES JobSeekers(SeekerID),
    FOREIGN KEY (ResumeID) REFERENCES Resumes(ResumeID)
);
SELECT * FROM Users;
INSERT INTO Users (Name, Email, Password, Role)
VALUES
('Admin', 'admin@gmail.com', 'admin123', 'ADMIN'),
('Rahul', 'rahul@gmail.com', 'rahul123', 'JOBSEEKER'),
('Priya', 'priya@gmail.com', 'priya123', 'JOBSEEKER'),
('ABC Company', 'hr@abc.com', 'hr123', 'EMPLOYER');
INSERT INTO Categories (CategoryName)
VALUES
('Software Development'),
('Web Development'),
('Data Science'),
('AI & Machine Learning'),
('Cyber Security'),
('Cloud Computing');
SELECT * FROM Categories;
INSERT INTO Employers (UserID, CompanyName, CompanyDescription, Location)
VALUES
(4, 'ABC Technologies', 'Software and IT Solutions Company', 'Chennai');
SELECT * FROM Employers;
DESCRIBE Employers;
SELECT * FROM Employers;
INSERT INTO Companies (EmployerID, CategoryID, CompanyName)
VALUES
(1, 1, 'ABC Technologies');
SELECT * FROM Companies;
INSERT INTO JobSeekers (UserID, FullName, Email)
VALUES
(2, 'Rahul Kumar', 'rahul@gmail.com'),
(3, 'Priya Sharma', 'priya@gmail.com');
SELECT * FROM JobSeekers;
INSERT INTO Resumes (SeekerID, FilePath, Skills, Education, Experience)
VALUES
(1, 'resumes/rahul.pdf', 'Java, Spring Boot, MySQL', 'B.E CSE', 'Fresher'),
(2, 'resumes/priya.pdf', 'Python, React, SQL', 'B.E CSE', '1 Year');
SELECT * FROM Resumes;
INSERT INTO Jobs
(EmployerID, Title, Description, CategoryID, Location, Salary)
VALUES
(1, 'Java Developer', 'Develop Java applications using Spring Boot', 1, 'Chennai', 50000),
(1, 'Web Developer', 'Develop and maintain web applications', 2, 'Chennai', 45000),
(1, 'Data Analyst', 'Analyze data and prepare reports', 3, 'Bangalore', 40000);
SELECT * FROM Jobs;
INSERT INTO Applications
(JobID, SeekerID, ResumeID, Status)
VALUES
(1, 1, 1, 'Applied'),
(2, 2, 2, 'Applied'),
(3, 1, 1, 'Under Review');
SELECT * FROM Applications;
USE jobportal;
