Here’s a more natural, first-person version that sounds human and project-ready:

⸻

Digital Library Catalogue System – Frontend

Overview

I built the frontend of the Digital Library Catalogue System using HTML, CSS, and JavaScript. It provides a clean, responsive interface that allows users to browse books, manage borrowing, and handle authentication while communicating seamlessly with the backend API.

Features Implemented
	•	User registration and login
	•	Book catalogue display
	•	Search and filter functionality
	•	Borrow and return book management
	•	Admin panel for adding and deleting books
	•	Responsive design for different screen sizes
	•	Real-time updates from the backend

Pages
	1.	index.html – Displays all available books with search and filter options
	2.	login.html – Handles user login and registration
	3.	dashboard.html – Allows users to view and return borrowed books
	4.	admin.html – Used by admins to manage books and view borrowing records

How to Run

Local Development
	1.	I update the API_BASE_URL in script.js to match the backend URL.
	2.	I then open index.html in a web browser to start using the application.

Default Test Accounts

Admin Account
	•	Email: admin@library.com
	•	Password: admin123

Student Accounts
	•	kwame.mensah@example.com
	•	abena.serwaa@example.com
	•	yaw.boakye@example.com
	•	esi.adomako@example.com

API Integration

All communication with the backend is handled using the JavaScript Fetch API. I implemented proper error handling and secured all protected routes using JWT authentication.

Technologies Used
	•	HTML5
	•	CSS3 (Flexbox and Grid)
	•	Vanilla JavaScript (ES6+)
	•	Font Awesome Icons (v6.4.0)

Browser Compatibility

The application works well on the latest versions of:
	•	Google Chrome
	•	Mozilla Firefox
	•	Safari
	•	Microsoft Edge

Configuration

To connect the frontend to the backend, I update the API base URL in script.js:

const API_BASE_URL = 'http://localhost:3000/api';

For production deployment:

const API_BASE_URL = 'https://your-render-backend-url.onrender.com/api';

Key Features
	•	Browsing books with full details
	•	Searching by title or author
	•	Borrowing books (login required)
	•	Returning borrowed books
	•	Admin dashboard for book and borrow management
	•	Viewing borrowing statistics on the user dashboard

Notes
	•	All user passwords are securely hashed
	•	JWT tokens expire after 24 hours
	•	Books can be borrowed for a maximum of 14 days
	•	Only admin users are allowed to manage books

⸻

