const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { pool, initializeDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

initializeDatabase();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/api/register', async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id, full_name, email, role',
      [full_name, email, hashedPassword, 'student']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/books', async (req, res) => {
  try {
    const { search, author } = req.query;
    
    let query = `
      SELECT b.*, a.name as author_name, a.nationality 
      FROM books b 
      JOIN authors a ON b.author_id = a.author_id
    `;
    let params = [];
    let conditions = [];
    
    if (search) {
      conditions.push(`(b.title ILIKE $${params.length + 1} OR a.name ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }
    
    if (author) {
      conditions.push(`a.author_id = $${params.length + 1}`);
      params.push(author);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY b.title';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

app.get('/api/authors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM authors ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch authors' });
  }
});

app.post('/api/borrow', authenticateToken, async (req, res) => {
  try {
    const { book_id } = req.body;
    const user_id = req.user.user_id;
    
    const bookResult = await pool.query(
      'SELECT copies_available FROM books WHERE book_id = $1',
      [book_id]
    );
    
    if (bookResult.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    if (bookResult.rows[0].copies_available <= 0) {
      return res.status(400).json({ error: 'Book not available' });
    }
    
    const existingBorrow = await pool.query(
      'SELECT * FROM borrow_records WHERE user_id = $1 AND book_id = $2 AND return_date IS NULL',
      [user_id, book_id]
    );
    
    if (existingBorrow.rows.length > 0) {
      return res.status(400).json({ error: 'You already borrowed this book' });
    }
    
    const borrowResult = await pool.query(
      'INSERT INTO borrow_records (user_id, book_id, borrow_date) VALUES ($1, $2, CURRENT_DATE) RETURNING *',
      [user_id, book_id]
    );
    
    await pool.query(
      'UPDATE books SET copies_available = copies_available - 1 WHERE book_id = $1',
      [book_id]
    );
    
    res.status(201).json(borrowResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to borrow book' });
  }
});

app.post('/api/return/:record_id', authenticateToken, async (req, res) => {
  try {
    const { record_id } = req.params;
    
    const recordResult = await pool.query(
      'SELECT * FROM borrow_records WHERE record_id = $1 AND user_id = $2 AND return_date IS NULL',
      [record_id, req.user.user_id]
    );
    
    if (recordResult.rows.length === 0) {
      return res.status(404).json({ error: 'Borrow record not found' });
    }
    
    await pool.query(
      'UPDATE borrow_records SET return_date = CURRENT_DATE WHERE record_id = $1',
      [record_id]
    );
    
    await pool.query(
      'UPDATE books SET copies_available = copies_available + 1 WHERE book_id = $1',
      [recordResult.rows[0].book_id]
    );
    
    res.json({ message: 'Book returned successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to return book' });
  }
});

app.get('/api/my-books', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT br.*, b.title, b.isbn, a.name as author_name
       FROM borrow_records br
       JOIN books b ON br.book_id = b.book_id
       JOIN authors a ON b.author_id = a.author_id
       WHERE br.user_id = $1
       ORDER BY br.borrow_date DESC`,
      [req.user.user_id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch borrowed books' });
  }
});

app.post('/api/admin/books', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { title, author_id, isbn, published_year, copies_available } = req.body;
    
    const result = await pool.query(
      `INSERT INTO books (title, author_id, isbn, published_year, copies_available)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, author_id, isbn, published_year, copies_available]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

app.put('/api/admin/books/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { id } = req.params;
    const { title, author_id, isbn, published_year, copies_available } = req.body;
    
    const result = await pool.query(
      `UPDATE books 
       SET title = $1, author_id = $2, isbn = $3, published_year = $4, copies_available = $5
       WHERE book_id = $6 RETURNING *`,
      [title, author_id, isbn, published_year, copies_available, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

app.delete('/api/admin/books/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { id } = req.params;
    
    const borrowed = await pool.query(
      'SELECT * FROM borrow_records WHERE book_id = $1 AND return_date IS NULL',
      [id]
    );
    
    if (borrowed.rows.length > 0) {
      return res.status(400).json({ error: 'Cannot delete borrowed book' });
    }
    
    await pool.query('DELETE FROM books WHERE book_id = $1', [id]);
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

app.get('/api/admin/borrow-records', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const result = await pool.query(
      `SELECT br.*, u.full_name as user_name, u.email, b.title as book_title
       FROM borrow_records br
       JOIN users u ON br.user_id = u.user_id
       JOIN books b ON br.book_id = b.book_id
       ORDER BY br.borrow_date DESC`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch borrow records' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});