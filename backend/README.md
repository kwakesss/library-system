# Digital Library Catalogue System - Backend

## Overview
Node.js + Express + PostgreSQL backend for the Digital Library Catalogue System.

## Requirements
- Node.js (v14+)
- npm (v6+)
- PostgreSQL database

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure `.env` file with your database credentials:
```env
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-password
DB_NAME=your-database-name
DB_PORT=5432
JWT_SECRET=your-secret-key
PORT=3000
```

3. Run the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Books
- `GET /api/books` - Get all books (supports ?search= and ?author= query params)
- `GET /api/authors` - Get all authors

### User Operations (requires authentication)
- `GET /api/my-books` - Get user's borrowed books
- `POST /api/borrow` - Borrow a book
- `POST /api/return/:record_id` - Return a book

### Admin Operations (requires admin role)
- `POST /api/admin/books` - Add new book
- `PUT /api/admin/books/:id` - Update book
- `DELETE /api/admin/books/:id` - Delete book
- `GET /api/admin/borrow-records` - Get all borrow records

## Database Setup

Your PostgreSQL database schema includes:

### Tables
- **authors** - Book authors
- **books** - Book catalogue
- **users** - User accounts
- **borrow_records** - Borrowing history

### Sample Data
The database comes pre-populated with:
- 6 African authors (Ghanaian, Nigerian, Botswana, Kenyan)
- 8 classic African literature books
- 4 sample users with borrowing records

## Environment Variables

```env
DB_HOST                 - PostgreSQL host
DB_USER                 - Database username
DB_PASSWORD             - Database password
DB_NAME                 - Database name
DB_PORT                 - Database port (default: 5432)
JWT_SECRET              - Secret key for JWT signing
PORT                    - Server port (default: 3000)
NODE_ENV                - Environment (development/production)
```

## Dependencies

- **express** - Web framework
- **pg** - PostgreSQL client
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication

## Server Details

- Default Port: 3000
- CORS: Enabled for all origins
- Database Connection: Pooled for performance
- SSL: Required for production database connections

## Features

✅ User Registration & Login  
✅ Password hashing with bcryptjs  
✅ JWT authentication  
✅ Search books by title/author  
✅ Book borrowing/returning  
✅ Admin book management  
✅ Error handling  
✅ CORS enabled  

## Testing

Admin credentials for testing:
- Email: admin@library.com
- Password: admin123 (auto-created on first run)

## Production Deployment

1. Update JWT_SECRET in .env
2. Set NODE_ENV=production
3. Configure CORS for specific frontend URL
4. Use HTTPS for all connections
5. Enable database SSL
6. Set strong passwords

## Support

For issues or questions, check:
- Server logs for errors
- Database connection settings
- CORS configuration
- JWT token expiration
