// backend/seed.js

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./marketplace.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the marketplace database for seeding.');
});

const products = [
    {
        name: 'Vintage Bicycle',
        description: 'Classic Indian bicycle, needs some TLC but rides well. Perfect for local errands in Kothri Kalan.',
        price: 4500.00,
        imageUrl: 'Uploads/seed-image-1.jpg',
        sellerContact: 'market.admin@example.com'
    },
    {
        name: 'Handmade Terracotta Pots',
        description: 'Assorted sizes of traditional clay pots, perfect for gardening or home decor.',
        price: 800.00,
        imageUrl: 'Uploads/seed-image-2.jpg',
        sellerContact: 'market.admin@example.com'
    },
    {
        name: 'Farm Fresh Vegetables',
        description: 'A weekly basket of seasonal vegetables from a local farm near Bhopal, organically grown and delivered fresh.',
        price: 350.00,
        imageUrl: 'Uploads/seed-image-3.jpg',
        sellerContact: 'market.admin@example.com'
    }
];

db.serialize(() => {
    console.log('Creating tables...');
    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL)`);
    db.run(`CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT NOT NULL, price REAL NOT NULL, imageUrl TEXT, sellerContact TEXT NOT NULL, userId INTEGER, FOREIGN KEY (userId) REFERENCES users (id))`, (err) => {
        if (err) {
            return console.error('Error creating products table:', err.message);
        }
        console.log('Products table created or already exists.');

        const stmt = db.prepare(`INSERT INTO products (name, description, price, imageUrl, sellerContact) VALUES (?, ?, ?, ?, ?)`);

        console.log('Inserting seed products...');
        for (const product of products) {
            stmt.run(product.name, product.description, product.price, product.imageUrl, product.sellerContact);
        }

        stmt.finalize((err) => {
            if (err) {
                return console.error('Error finalizing statement:', err.message);
            }
            console.log('All seed products have been inserted.');

            // Close the database connection ONLY after the last operation is complete.
            db.close((err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log('Database connection closed. Seeding complete!');
            });
        });
    });
});