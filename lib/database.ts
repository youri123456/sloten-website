import { Database } from 'sqlite3';

// TypeScript interfaces
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    features: string;
    created_at: string;
}

interface Order {
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: string;
    customer_city: string;
    customer_postal_code: string;
    total_amount: number;
    order_items: string;
    status: string;
    payment_intent_id: string;
    created_at: string;
}

interface AdminUser {
    id: number;
    username: string;
    password_hash: string;
    created_at: string;
}

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    created_at: string;
}

interface SiteStats {
    total_visits: number;
    unique_visitors: number;
    today_visits: number;
    week_visits: number;
    month_visits: number;
}

interface OrderItem {
    id: number;
    quantity: number;
}

interface OrderData {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: string;
    customer_city: string;
    customer_postal_code: string;
    total_amount: number;
    order_items: OrderItem[];
    payment_intent_id: string;
}

interface ProductData {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    features: string[];
}

interface MessageData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const db = new Database('./webshop.db');

// Initialize database tables
export const initDatabase = (): Promise<boolean> => {
    return new Promise((resolve) => {
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
        payment_intent_id TEXT,
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

            // Contact messages table
            db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'new',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

            // Insert default products
            db.run(`INSERT OR IGNORE INTO products (name, description, price, image, category, stock, features) VALUES 
        ('Smart Fietsslot Pro', 'Revolutionair fietsslot dat je met je smartphone kunt openen. Inclusief alarm en GPS-tracking. Waterdicht en ultra-sterk materiaal.', 89.99, '/images/fietsslot.png', 'fietsslot', 25, '["Smartphone opening", "Alarm functie", "GPS tracking", "Waterdicht", "Ultra-sterk materiaal", "Batterij duurt 6 maanden"]'),
        ('Smart Kabelslot Secure', 'Flexibel kabelslot met smartphone bediening en alarm. Perfect voor motoren, fietsen en andere voertuigen. Verstelbare kabellengte.', 79.99, '/images/kettingslot.png', 'kabelslot', 30, '["Smartphone opening", "Alarm functie", "Verstelbare kabel", "Weersbestendig", "Lange batterijduur", "Bluetooth connectie"]')`);

            resolve(true);
        });
    });
};

// Database query functions
export const getAllProducts = (): Promise<Product[]> => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM products ORDER BY id", (err, rows) => {
            if (err) reject(err);
            else resolve(rows as Product[]);
        });
    });
};

export const getProductById = (id: number): Promise<Product | undefined> => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
            if (err) reject(err);
            else resolve(row as Product | undefined);
        });
    });
};

// Reduce stock for multiple products (used when creating orders)
export const reduceProductStock = (products: { id: number; quantity: number }[]): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("BEGIN TRANSACTION");

            let hasError = false;
            let completed = 0;

            products.forEach(({ id, quantity }) => {
                db.run("UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
                    [quantity, id, quantity],
                    function (err: Error | null) {
                        if (err || this.changes === 0) {
                            hasError = true;
                        }
                        completed++;

                        if (completed === products.length) {
                            if (hasError) {
                                db.run("ROLLBACK", () => {
                                    reject(new Error("Insufficient stock for one or more products"));
                                });
                            } else {
                                db.run("COMMIT", (err: Error | null) => {
                                    if (err) reject(err);
                                    else resolve();
                                });
                            }
                        }
                    });
            });
        });
    });
};

export const createOrder = (orderData: OrderData): Promise<number> => {
    return new Promise((resolve, reject) => {
        const { customer_name, customer_email, customer_phone, customer_address, customer_city, customer_postal_code, total_amount, order_items, payment_intent_id } = orderData;

        // First, reduce stock for all products
        const stockReductions = order_items.map((item: OrderItem) => ({
            id: item.id,
            quantity: item.quantity
        }));

        reduceProductStock(stockReductions)
            .then(() => {
                // If stock reduction is successful, create the order
                db.run(`INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, customer_city, customer_postal_code, total_amount, order_items, payment_intent_id) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [customer_name, customer_email, customer_phone, customer_address, customer_city, customer_postal_code, total_amount, JSON.stringify(order_items), payment_intent_id],
                    function (err: Error | null) {
                        if (err) reject(err);
                        else resolve(this.lastID);
                    });
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getAllOrders = (): Promise<Order[]> => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM orders ORDER BY created_at DESC", (err, rows) => {
            if (err) reject(err);
            else resolve(rows as Order[]);
        });
    });
};

export const updateOrderStatus = (orderId: number, status: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run("UPDATE orders SET status = ? WHERE id = ?", [status, orderId], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

export const getAdminUser = (username: string): Promise<AdminUser | undefined> => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM admin_users WHERE username = ?", [username], (err, row) => {
            if (err) reject(err);
            else resolve(row as AdminUser | undefined);
        });
    });
};

export const logSiteVisit = (visitorIp: string, userAgent: string, pagePath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO site_visits (visitor_ip, user_agent, page_path) VALUES (?, ?, ?)",
            [visitorIp, userAgent, pagePath], (err) => {
                if (err) reject(err);
                else resolve();
            });
    });
};

export const getSiteStats = (): Promise<SiteStats> => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT 
              COUNT(*) as total_visits,
              COUNT(DISTINCT visitor_ip) as unique_visitors,
              COUNT(CASE WHEN DATE(created_at) = DATE('now') THEN 1 END) as today_visits,
              COUNT(CASE WHEN DATE(created_at) >= DATE('now', '-7 days') THEN 1 END) as week_visits,
              COUNT(CASE WHEN DATE(created_at) >= DATE('now', '-30 days') THEN 1 END) as month_visits
            FROM site_visits`, (err, rows) => {
            if (err) reject(err);
            else resolve((rows[0] as SiteStats) || { total_visits: 0, unique_visitors: 0, today_visits: 0, week_visits: 0, month_visits: 0 });
        });
    });
};

// Product CRUD functions
export const createProduct = (productData: ProductData): Promise<number> => {
    return new Promise((resolve, reject) => {
        const { name, description, price, image, category, stock, features } = productData;

        db.run(`INSERT INTO products (name, description, price, image, category, stock, features) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, description, price, image, category, stock, JSON.stringify(features)],
            function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
    });
};

export const updateProduct = (id: number, productData: ProductData): Promise<void> => {
    return new Promise((resolve, reject) => {
        const { name, description, price, image, category, stock, features } = productData;

        db.run(`UPDATE products 
            SET name = ?, description = ?, price = ?, image = ?, category = ?, stock = ?, features = ? 
            WHERE id = ?`,
            [name, description, price, image, category, stock, JSON.stringify(features), id],
            (err) => {
                if (err) reject(err);
                else resolve();
            });
    });
};

export const deleteProduct = (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM products WHERE id = ?", [id], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

// Contact messages functions
export const createContactMessage = (messageData: MessageData): Promise<number> => {
    return new Promise((resolve, reject) => {
        const { name, email, subject, message } = messageData;

        db.run(`INSERT INTO contact_messages (name, email, subject, message) 
            VALUES (?, ?, ?, ?)`,
            [name, email, subject, message],
            function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
    });
};

export const getAllContactMessages = (): Promise<ContactMessage[]> => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM contact_messages ORDER BY created_at DESC", (err, rows) => {
            if (err) reject(err);
            else resolve(rows as ContactMessage[]);
        });
    });
};

export const updateContactMessageStatus = (messageId: number, status: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run("UPDATE contact_messages SET status = ? WHERE id = ?", [status, messageId], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

export default db; 