# Digital Library Catalogue System - Frontend

## Overview
HTML/CSS/JavaScript frontend for the Digital Library Catalogue System.

## Features Implemented
✅ User Registration & Authentication  
✅ Book Catalogue Display  
✅ Search and Filter Functionality  
✅ Borrow & Return Management  
✅ Admin Panel (Add/Delete Books)  
✅ Responsive Design  
✅ Real-time Updates  

## Pages
1. **index.html** - Browse all books with search/filter
2. **login.html** - User authentication (Login/Register)
3. **dashboard.html** - View borrowed books and return them
4. **admin.html** - Manage books and view all borrow records

## How to Run

### Local Development
1. Update `API_BASE_URL` in `script.js` to match your backend URL
2. Open `index.html` in your web browser

### Default Test Accounts
**Admin Account:**
- Email: admin@library.com
- Password: admin123

**Student Accounts:**
- Email: kwame.mensah@example.com
- Email: abena.serwaa@example.com
- Email: yaw.boakye@example.com
- Email: esi.adomako@example.com

## API Integration
All API calls use JavaScript Fetch API with proper error handling and JWT authentication.

## Technologies Used
- HTML5
- CSS3 (Flexbox/Grid)
- Vanilla JavaScript (ES6+)
- Font Awesome Icons (6.4.0)

## Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Configuration
Update the API base URL in `script.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

Or for production:
```javascript
const API_BASE_URL = 'https://your-render-backend-url.onrender.com/api';
```

## Features
- **Browse Books**: View all books with detailed information
- **Search**: Filter books by title or author
- **Borrow**: Borrow books (requires login)
- **Return**: Return borrowed books
- **Admin Dashboard**: Add/delete books and manage all borrow records
- **Statistics**: View borrowing statistics on user dashboard

## Notes
- All passwords are hashed and stored securely
- JWT tokens expire after 24 hours
- Books have a 14-day borrowing period
- Only admins can manage books
