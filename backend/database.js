const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to PostgreSQL database');
    release();
  }
});

const initializeDatabase = async () => {
  try {
    try {
      await pool.query(`ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'student'`);
    } catch (err) {
    }
    
    try {
      await pool.query(`ALTER TABLE users ADD COLUMN password VARCHAR(255)`);
    } catch (err) {
    }
    
    const checkAdmin = await pool.query(
      "SELECT * FROM users WHERE email = 'admin@library.com'"
    );
    
    if (checkAdmin.rows.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await pool.query(
        "INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4)",
        ['Library Admin', 'admin@library.com', hashedPassword, 'admin']
      );
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = { pool, initializeDatabase };