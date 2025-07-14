import { initDatabase } from '../lib/database';
import bcrypt from 'bcryptjs';
import db from '../lib/database';

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
                }
            });

        console.log('Database initialization completed');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

initializeDatabase(); 