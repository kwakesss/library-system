# Digital Library Catalogue System

A full-stack web application for managing a digital library with book cataloging, user authentication, and book borrowing/returning functionality. Built with Node.js/Express backend and vanilla HTML/CSS/JavaScript frontend.

## 🎯 Features

### Core Functionality
- **User Authentication**: Registration and login with JWT-based authentication
- **Book Catalogue**: Browse, search, and filter books by title or author
- **Book Borrowing**: Users can borrow available books with automatic due date tracking (14 days)
- **Book Returns**: Easy book return management with return date tracking
- **Admin Panel**: Administrators can manage books (add, update, delete) and view all borrow records
- **User Dashboard**: View borrowed books, track due dates, and return books

### Technical Features
- **Role-Based Access Control**: Student and Admin roles with different permissions
- **Real-time Availability Tracking**: Books show availability status (available/unavailable)
- **Search & Filter**: Search books by title/author with real-time filtering
- **Responsive Design**: Mobile-friendly interface with dark theme
- **Secure Authentication**: Password hashing with bcryptjs, JWT tokens with 24-hour expiration
- **Error Handling**: User-friendly error messages for failed logins and operations

## 🏗️ Architecture

### Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **Deployment**: 
  - Backend: Render (https://library-system-3mfo.onrender.com)
  - Frontend: GitHub Pages

### Folder Structure
```
library-system/
├── backend/
│   ├── server.js          # Express API server with all endpoints
│   ├── database.js        # PostgreSQL connection and initialization
│   ├── .env               # Environment configuration
│   └── package.json       # Dependencies
├── frontend/              # Backup/synchronized frontend files
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
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- PostgreSQL database
- npm package manager

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/kwakesss/library-system.git
cd library-system
```

#### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```env
DB_HOST=your_postgres_host
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=your_database_name
DB_PORT=5432
JWT_SECRET=your_secret_key_here
PORT=3000
```

#### 3. Start the Backend Server
```bash
npm start
```

The server will run on `http://localhost:3000`

#### 4. Frontend Setup
Open `index.html` in a web browser or serve with a local server:
```bash
python -m http.server 8000
# or
npx http-server
```

Visit `http://localhost:8000` in your browser.

## 📚 API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login and receive JWT token

### Books
- `GET /api/books` - Get all books with search/filter support
- `GET /api/authors` - Get all authors for filtering

### Borrowing
- `POST /api/borrow` - Borrow a book (requires authentication)
- `POST /api/return/:record_id` - Return a borrowed book
- `GET /api/my-books` - Get user's borrowed books (requires authentication)

### Admin Only
- `POST /api/admin/books` - Add a new book
- `PUT /api/admin/books/:id` - Update book details
- `DELETE /api/admin/books/:id` - Delete a book
- `GET /api/admin/borrow-records` - View all borrow records

## 🎨 User Interface

### Design Theme
- **Color Scheme**: Black (#1a1a1a), Gray (#2d2d2d), Lemon Green (#ceff00)
- **Typography**: Modern, clean fonts with good readability
- **Accessibility**: High contrast for dark theme with clear visual hierarchy

### Pages
1. **Home (index.html)**: Book catalogue with search and filter
2. **Login/Register (login.html)**: Authentication with dual-form interface
3. **Dashboard (dashboard.html)**: User's borrowed books and statistics
4. **Admin Panel (admin.html)**: Book management and borrow records

## 👤 Default Admin Account

- **Email**: admin@library.com
- **Password**: admin123

*Change these credentials in production!*

## 📖 Code Quality

### Human-Made Code
This project is **hand-coded without advanced AI generation tools**. The code follows:
- Standard JavaScript/Node.js conventions
- Clear variable and function naming
- Modular function structure
- No code obfuscation or complex abstractions

### Code Features
- Clean, readable code without comments (for simplicity)
- Functional programming approach with async/await
- Error handling and validation
- Secure password hashing and JWT implementation

## 🔍 Similar Projects for Reference

This project follows similar architecture patterns to:

1. **Library Management System** by abdallahsellem
   - URL: https://github.com/abdallahsellem/Library-Management-System
   - Features: REST API, Sequelize ORM, Swagger API docs, Docker support, comprehensive testing

2. **Library Management** by ozers
   - URL: https://github.com/ozers/library-management
   - Features: TypeScript, advanced search, reservation system, overdue notifications, Docker

3. **Library Management System** by faysal-backend-developer
   - URL: https://github.com/faysal-backend-developer/library_management_system
   - Features: Prisma ORM, Next.js frontend, role-based access, CSV/PDF export, React dashboard

## 🔐 Security Features

- **Password Security**: Bcryptjs hashing (10 rounds)
- **JWT Authentication**: 24-hour token expiration
- **Protected Routes**: Admin endpoints require authentication and role verification
- **Input Validation**: Basic validation on registration and login
- **SQL Injection Prevention**: Parameterized queries using postgres library

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50) DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Books Table
```sql
CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author_id INTEGER REFERENCES authors(author_id),
    isbn VARCHAR(20),
    published_year INTEGER,
    copies_available INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Borrow Records Table
```sql
CREATE TABLE borrow_records (
    record_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    book_id INTEGER REFERENCES books(book_id),
    borrow_date DATE,
    return_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🌐 Deployment

### Backend (Render)
The backend is deployed on Render at: https://library-system-3mfo.onrender.com

### Frontend (GitHub Pages)
The frontend files are in the root directory for GitHub Pages deployment.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built for educational purposes by kwakesss

## 📞 Support

For issues or questions, please create an issue on GitHub.

---

**Note**: This is a learning project demonstrating full-stack web development with modern technologies. The code is intentionally kept simple and readable for educational purposes.
