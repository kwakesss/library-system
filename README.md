Here is a more casual, natural version, written in first person, with all emojis and hashtags removed, and without removing or losing any details. The tone is relaxed and clearly human, suitable for a personal project, portfolio, or school submission.

⸻

Digital Library Catalogue System

I built a full-stack web application for managing a digital library. The system allows users to register and log in, browse and search for books, borrow and return books, and for administrators to manage the entire catalogue. The backend is built with Node.js and Express, while the frontend uses plain HTML, CSS, and JavaScript.

Features

Core Functionality
	•	User authentication with registration and login using JWT.
	•	A book catalogue where users can browse, search, and filter books by title or author.
	•	Book borrowing with automatic due date tracking set to 14 days.
	•	Book return functionality with proper return date tracking.
	•	An admin panel where administrators can add, update, and delete books, as well as view all borrow records.
	•	A user dashboard that shows borrowed books, due dates, and return options.

Technical Features
	•	Role-based access control with Student and Admin roles.
	•	Real-time tracking of book availability.
	•	Search and filter functionality for books by title or author.
	•	A responsive, mobile-friendly interface with a dark theme.
	•	Secure authentication using bcryptjs for password hashing and JWT tokens with a 24-hour expiration.
	•	Clear and user-friendly error messages for failed logins and other operations.

Architecture

Technology Stack
	•	Frontend: HTML5, CSS3, Vanilla JavaScript (ES6+)
	•	Backend: Node.js, Express.js
	•	Database: PostgreSQL
	•	Authentication: JWT (jsonwebtoken), bcryptjs
	•	Deployment:
	•	Backend hosted on Render at https://library-system-3mfo.onrender.com
	•	Frontend deployed using GitHub Pages

Folder Structure

library-system/
├── backend/
│   ├── server.js
│   ├── database.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── admin.html
│   ├── style.css
│   └── script.js
├── index.html
├── login.html
├── dashboard.html
├── admin.html
├── style.css
├── script.js
└── README.md

Getting Started

Prerequisites
	•	Node.js (v14 or higher)
	•	PostgreSQL
	•	npm

Installation and Setup

1. Clone the repository

git clone https://github.com/kwakesss/library-system.git
cd library-system

2. Set up the backend

cd backend
npm install

Create a .env file in the backend folder:

DB_HOST=your_postgres_host
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=your_database_name
DB_PORT=5432
JWT_SECRET=your_secret_key_here
PORT=3000

3. Start the backend server

npm start

The server will run on http://localhost:3000.

4. Run the frontend
You can open index.html directly in a browser or use a local server:

python -m http.server 8000
or
npx http-server

Then visit http://localhost:8000.

API Endpoints

Authentication
	•	POST /api/register – Register a new user
	•	POST /api/login – Log in and receive a JWT token

Books
	•	GET /api/books – Get all books with search and filter support
	•	GET /api/authors – Get all authors for filtering

Borrowing
	•	POST /api/borrow – Borrow a book (authentication required)
	•	POST /api/return/:record_id – Return a borrowed book
	•	GET /api/my-books – Get the logged-in user’s borrowed books

Admin Only
	•	POST /api/admin/books – Add a new book
	•	PUT /api/admin/books/:id – Update book details
	•	DELETE /api/admin/books/:id – Delete a book
	•	GET /api/admin/borrow-records – View all borrow records

User Interface

Design Theme
	•	Dark theme with black, gray, and lemon green accents
	•	Clean, modern fonts with good readability
	•	High contrast for better accessibility

Pages
	1.	Home (index.html): Book catalogue with search and filter
	2.	Login/Register (login.html): Authentication page with login and registration forms
	3.	Dashboard (dashboard.html): Shows borrowed books and due dates
	4.	Admin Panel (admin.html): Book management and borrow records

Default Admin Account

Email: admin@library.com
Password: admin123

These credentials should be changed in production.

Code Quality

Code

The code focused on:
	•	Standard JavaScript and Node.js conventions
	•	Clear and meaningful variable and function names
	•	Simple, readable structure without unnecessary abstractions

Code Features
	•	Clean and readable code without comments to keep things simple
	•	Use of async and await
	•	Proper error handling and basic validation
	•	Secure password hashing and JWT authentication

Similar Projects for Reference

This project follows patterns similar to:
	1.	Library Management System by abdallahsellem
https://github.com/abdallahsellem/Library-Management-System
	2.	Library Management by ozers
https://github.com/ozers/library-management
	3.	Library Management System by faysal-backend-developer
https://github.com/faysal-backend-developer/library_management_system

Security Features
	•	Passwords are hashed using bcryptjs with 10 salt rounds
	•	JWT authentication with 24-hour token expiration
	•	Admin routes are protected and require role verification
	•	Basic input validation during registration and login
	•	Parameterized SQL queries to help prevent SQL injection

Database Schema

Users Table

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50) DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Books Table

CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author_id INTEGER REFERENCES authors(author_id),
    isbn VARCHAR(20),
    published_year INTEGER,
    copies_available INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Borrow Records Table

CREATE TABLE borrow_records (
    record_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    book_id INTEGER REFERENCES books(book_id),
    borrow_date DATE,
    return_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Deployment

Backend

The backend is deployed on Render at
https://library-system-3mfo.onrender.com

Frontend

The frontend is deployed using GitHub Pages, with all frontend files located in the root directory.

Contributing

Contributions are welcome. Feel free to open an issue or submit a pull request.

License

This project is open source and available under the MIT License.

Author

Built for educational purposes by kwakesss

Support

If you run into any issues or have questions, please create an issue on GitHub.

⸻
