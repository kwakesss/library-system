Digital Library Catalogue System – Backend

Overview

I built this backend using Node.js, Express, and PostgreSQL for the Digital Library Catalogue System. It handles authentication, book management, and borrowing operations for the application.

Requirements

To run this project, I use:
	•	Node.js (v14 or higher)
	•	npm (v6 or higher)
	•	A PostgreSQL database

Installation
	1.	I install the project dependencies:

npm install

	2.	I configure the .env file with my database and server settings:

DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-password
DB_NAME=your-database-name
DB_PORT=5432
JWT_SECRET=your-secret-key
PORT=3000

	3.	I start the server:

npm start

For development with automatic reload, I run:

npm run dev

API Endpoints

Authentication
	•	POST /api/register – I use this to register a new user
	•	POST /api/login – I use this to log in a user

Books
	•	GET /api/books – I use this to get all books, with support for ?search= and ?author= query parameters
	•	GET /api/authors – I use this to get all authors

User Operations (requires authentication)
	•	GET /api/my-books – I use this to get the books borrowed by the logged-in user
	•	POST /api/borrow – I use this to borrow a book
	•	POST /api/return/:record_id – I use this to return a borrowed book

Admin Operations (requires admin role)
	•	POST /api/admin/books – I use this to add a new book
	•	PUT /api/admin/books/:id – I use this to update a book
	•	DELETE /api/admin/books/:id – I use this to delete a book
	•	GET /api/admin/borrow-records – I use this to get all borrow records

Database Setup

I use a PostgreSQL database with the following schema.

Tables
	•	authors – stores book authors
	•	books – stores the book catalogue
	•	users – stores user accounts
	•	borrow_records – stores borrowing history

Sample Data

The database is pre-populated with:
	•	Six African authors from Ghana, Nigeria, Botswana, and Kenya
	•	Eight classic African literature books
	•	Four sample users with borrowing records

Environment Variables

DB_HOST                 - PostgreSQL host  
DB_USER                 - Database username  
DB_PASSWORD             - Database password  
DB_NAME                 - Database name  
DB_PORT                 - Database port (default: 5432)  
JWT_SECRET              - Secret key for JWT signing  
PORT                    - Server port (default: 3000)  
NODE_ENV                - Environment (development or production)  

Dependencies

I use the following dependencies:
	•	express – web framework
	•	pg – PostgreSQL client
	•	cors – cross-origin resource sharing
	•	dotenv – environment variable management
	•	bcryptjs – password hashing
	•	jsonwebtoken – JWT-based authentication

Server Details
	•	Default port: 3000
	•	CORS: enabled for all origins
	•	Database connection: pooled for performance
	•	SSL: required for production database connections

Features
	•	User registration and login
	•	Password hashing using bcryptjs
	•	JWT authentication
	•	Searching books by title or author
	•	Book borrowing and returning
	•	Admin book management
	•	Centralized error handling
	•	CORS enabled

Testing

For testing purposes, I provide an admin account that is automatically created on the first run:
	•	Email: admin@library.com
	•	Password: admin123

Production Deployment

When deploying to production, I:
	1.	Update the JWT_SECRET in the .env file
	2.	Set NODE_ENV=production
	3.	Configure CORS to allow only the frontend URL
	4.	Use HTTPS for all connections
	5.	Enable SSL for the database
	6.	Set strong and secure passwords

Support

If I encounter issues, I check:
	•	Server logs for errors
	•	Database connection settings
	•	CORS configuration
	•	JWT token expiration settings