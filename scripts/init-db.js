const sqlite3 = require('sqlite3');
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./webshop.db');

function initDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Products table
            db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT NOT NULL,
        category TEXT NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        features TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

            // Orders table
            db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_address TEXT NOT NULL,
        customer_city TEXT NOT NULL,
        customer_postal_code TEXT NOT NULL,
        total_amount REAL NOT NULL,
        order_items TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

            // Admin users table
            db.run(`CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

            // Site analytics table
            db.run(`CREATE TABLE IF NOT EXISTS site_visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        visitor_ip TEXT,
        user_agent TEXT,
        page_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

            // Insert default products
            db.run(`INSERT OR IGNORE INTO products (name, description, price, image, category, stock, features) VALUES 
        ('Smart Fietsslot Pro', 'Revolutionair fietsslot dat je met je smartphone kunt openen. Inclusief alarm en GPS-tracking. Waterdicht en ultra-sterk materiaal.', 89.99, '/images/fietsslot.jpg', 'fietsslot', 25, '["Smartphone opening", "Alarm functie", "GPS tracking", "Waterdicht", "Ultra-sterk materiaal", "Batterij duurt 6 maanden"]'),
        ('Smart Kabelslot Secure', 'Flexibel kabelslot met smartphone bediening en alarm. Perfect voor motoren, fietsen en andere voertuigen. Verstelbare kabellengte.', 79.99, '/images/kabelslot.jpg', 'kabelslot', 30, '["Smartphone opening", "Alarm functie", "Verstelbare kabel", "Weersbestendig", "Lange batterijduur", "Bluetooth connectie"]')`);

            resolve();
        });
    });
}

async function initializeDatabase() {
    try {
        // Initialize database tables
        await initDatabase();
        console.log('Database tables created successfully');

        // Create admin user
        const hashedPassword = await bcrypt.hash('Youri.2003', 10);

        db.run(`INSERT OR REPLACE INTO admin_users (username, password_hash) VALUES (?, ?)`,
            ['Youribrouwers', hashedPassword],
            function (err) {
                if (err) {
                    console.error('Error creating admin user:', err);
                } else {
                    console.log('Admin user created successfully');
                    db.close();
                }
            });

        console.log('Database initialization completed');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

initializeDatabase(); 