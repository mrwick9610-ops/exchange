// backend/server.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
// Note: We don't need bcrypt or jwt for the seeder to work, but they are needed for the full app.

const app = express();
const port = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// --- ADD THESE LINES TO SERVE THE FRONTEND ---
// This serves all the static files (CSS, JS, images) from the 'frontend' folder
app.use(express.static(path.join(__dirname, '../frontend')));

// This makes sure that any direct navigation to a page (e.g., /browse.html) is handled by sending the corresponding file
app.get('/:page', (req, res) => {
    res.sendFile(path.join(__dirname, `../frontend/${req.params.page}`));
});
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, '../frontend')));

// --- ADD THIS NEW ROUTE FOR THE HOMEPAGE ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
// ------------------------------------------

// This makes sure that any direct navigation to a page is handled
app.get('/:page', (req, res) => {
    res.sendFile(path.join(__dirname, `../frontend/${req.params.page}`));
})

// --- Database Connection ---
const db = new sqlite3.Database('./marketplace.db', (err) => {
    if (err) { console.error(err.message); }
    console.log('Connected to the marketplace database.');
});

// --- Create Database Tables ---
db.serialize(() => {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )`);

    // Add a userId to the products table to link it to a user
    db.run(`CREATE TABLE IF NOT EXISTS products(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        imageUrl TEXT,
        sellerContact TEXT NOT NULL,
        userId INTEGER,
        FOREIGN KEY (userId) REFERENCES users (id)
    )`);
});

// --- 3. MULTER CONFIGURATION ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // The folder where files will be saved
    },
    filename: (req, file, cb) => {
        // Create a unique filename to prevent overwrites
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

// --- API ROUTES ---

app.get('/api/products', (req, res) => { /* ... (no changes here) ... */ });
app.get('/api/products/:id', (req, res) => { /* ... (no changes here) ... */ });

// == 4. MODIFY THE 'POST a new product' ENDPOINT ==
// We add 'upload.single("image")' as middleware. 'image' must match the form's input name.
app.post('/api/products', upload.single('image'), (req, res) => {
    // Text data is now in req.body
    const { name, description, price, sellerContact } = req.body;
    // File data is in req.file
    const imageUrl = req.file ? req.file.path.replace(/\\/g, "/") : null; // Get file path and normalize slashes for windows

    if (!name || !description || !price || !sellerContact) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const sql = `INSERT INTO products (name, description, price, imageUrl, sellerContact) VALUES (?, ?, ?, ?, ?)`;
    const params = [name, description, price, imageUrl, sellerContact];
    
    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ message: 'Error saving product to database.' });
        }
        res.status(201).json({ message: 'Product listed successfully!', productId: this.lastID });
    });
});

// --- Start the Server ---
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});