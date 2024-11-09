const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Tambahkan ini
const jwt = require('jsonwebtoken'); // Tambahkan ini

const app = express();
const port = 3001;
const jwtSecret = 'your-secret-key'; // Gantilah dengan kunci rahasia yang aman

app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) console.error('Database connection error:', err.message);
  else console.log('Connected to SQLite database');
});

// Middleware untuk verifikasi token JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token is missing or invalid' });

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is invalid or expired' });
    req.user = user; // simpan user info di req untuk akses lebih lanjut
    next();
  });
};

// Endpoint login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid username or password' });

    const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  });
});

// Protected route yang membutuhkan autentikasi
app.get('/api/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'This is a protected route', user: req.user });
});

// Shutdown server and close database on exit
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) console.error('Error closing database:', err.message);
    console.log('Closed SQLite database');
  });
  process.exit(0);
});

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
