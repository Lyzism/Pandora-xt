//SETUP SERVER 
//IMPORT TO BE PKG
// pkg server.js --targets node14-win-x64 --output server.exe 

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const port = 3001;
const jwtSecret = 'j@F9$kL2#qW8%tR1!mN3^zX4&bV7*eY6';

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const encryptionKey = process.env.ENCRYPTION_KEY ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex') : null;
const iv = process.env.IV ? Buffer.from(process.env.IV, 'hex') : null;

if (!encryptionKey || !iv) {
  throw new Error('Encryption key or IV is not set. Check your .env file.');
}

app.use(cors());
app.use(express.json());

const sqlite3BindingPath = path.join(__dirname, 'node_sqlite3.node');
process.env.NODE_SQLITE3_BINARY_PATH = sqlite3BindingPath;
console.log('Using SQLite3 binding from:', sqlite3BindingPath);

const dbPath = path.join(__dirname, 'database.sqlite');
console.log('Database path:', dbPath);

fs.access(dbPath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error('Database file does not exist:', err.message);
  } else {
    console.log('Database file exists at:', dbPath);
  }
});

const originalDbPath = path.join(__dirname, 'database.sqlite');
const tempDbPath = path.join(process.cwd(), 'database.sqlite');

if (!fs.existsSync(tempDbPath)) {
  console.log(`Copying database from ${originalDbPath} to ${tempDbPath}`);
  fs.copyFileSync(originalDbPath, tempDbPath);
}
console.log('Using temporary database path:', tempDbPath);

const db = new sqlite3.Database(tempDbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

const encryptFile = (buffer) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return encrypted;
};

const decryptFile = (encryptedBuffer) => {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error.message);
    throw new Error('Decryption failed. Ensure the encryption key and IV are correct.');
  }
};

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token is missing or invalid' });

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is invalid or expired' });
    req.user = user;
    next();
  });
};

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

app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // Check if file type is supported
  if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && 
      req.file.mimetype !== 'application/pdf') {
    return res.status(400).json({ message: 'Invalid file type. Only .docx and .pdf files are allowed.' });
  }

  try {
    const encryptedFile = encryptFile(req.file.buffer);
    res.setHeader('Content-Disposition', `attachment; filename="${req.file.originalname}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(encryptedFile);
  } catch (error) {
    console.error("Encryption error:", error);
    res.status(500).json({ message: 'File encryption failed.' });
  }
});

app.post('/api/preview', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // Check if file type is supported
  if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && 
      req.file.mimetype !== 'application/pdf') {
    return res.status(400).json({ message: 'Invalid file type. Only .docx and .pdf files are allowed.' });
  }

  try {
    const decryptedFile = decryptFile(req.file.buffer);
    res.setHeader('Content-Type', req.file.mimetype);
    res.send(decryptedFile);
  } catch (error) {
    console.error("Decryption error:", error);
    res.status(500).json({ message: 'File decryption failed.' });
  }
});


// Protected route need for requires authentication
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