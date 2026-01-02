const bcrypt = require('bcryptjs');

async function initializeDatabase(pool) {
    const client = await pool.connect();

    try {
        console.log('🔄 Initializing database scheme...');
        await client.query('BEGIN');

        // Admin users table
        await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Blog categories table
        await client.query(`
      CREATE TABLE IF NOT EXISTS blog_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Blog posts table
        await client.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        cover_image VARCHAR(500),
        category_id INTEGER REFERENCES blog_categories(id) ON DELETE SET NULL,
        tags TEXT[],
        featured BOOLEAN DEFAULT false,
        published BOOLEAN DEFAULT false,
        author_id INTEGER REFERENCES admins(id),
        view_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP
      )
    `);

        // Blog comments table
        await client.query(`
      CREATE TABLE IF NOT EXISTS blog_comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        comment TEXT NOT NULL,
        approved BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Indexes
        await client.query(`CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug)`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published) WHERE published = true`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id)`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC)`);

        // Default Admin
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@vrpl.com';

        const adminCheck = await client.query('SELECT id FROM admins WHERE username = $1', [adminUsername]);

        if (adminCheck.rows.length === 0) {
            const passwordHash = await bcrypt.hash(adminPassword, 10);
            await client.query(
                `INSERT INTO admins (username, password_hash, email) VALUES ($1, $2, $3)`,
                [adminUsername, passwordHash, adminEmail]
            );
            console.log(`✅ Default admin user created: ${adminUsername}`);
        }

        // Default Categories
        const defaultCategories = [
            { name: 'Technology', slug: 'technology', description: 'Advancements in plasma gasification' },
            { name: 'Environment', slug: 'environment', description: 'Environmental impact' },
            { name: 'Updates', slug: 'updates', description: 'Company news' },
            { name: 'News', slug: 'news', description: 'Industry news' }
        ];

        for (const category of defaultCategories) {
            await client.query(
                `INSERT INTO blog_categories (name, slug, description) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (slug) DO NOTHING`,
                [category.name, category.slug, category.description]
            );
        }

        await client.query('COMMIT');
        console.log('✅ Database initialization completed');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Database initialization failed:', error);
        // Don't throw - we might want the server to start even if init fails (though unlikely to work well)
        // But for now, log it clearly
    } finally {
        client.release();
    }
}

module.exports = initializeDatabase;
