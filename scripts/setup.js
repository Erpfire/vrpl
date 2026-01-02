const pool = require('../config/database');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('🔨 Creating database tables...');

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

    console.log('✅ Creating indexes...');

    // Indexes for blog_posts
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published) WHERE published = true
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true
    `);

    // Indexes for blog_comments
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON blog_comments(post_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_blog_comments_approved ON blog_comments(approved) WHERE approved = true
    `);

    console.log('✅ Tables and indexes created successfully!');

    console.log('\n👤 Creating default admin user...');

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@vrpl.com';

    const adminCheck = await client.query(
      'SELECT id FROM admins WHERE username = $1',
      [adminUsername]
    );

    if (adminCheck.rows.length === 0) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);

      await client.query(
        `INSERT INTO admins (username, password_hash, email)
         VALUES ($1, $2, $3)`,
        [adminUsername, passwordHash, adminEmail]
      );

      console.log(`✅ Admin user created:`);
      console.log(`   Username: ${adminUsername}`);
      console.log(`   Password: ${adminPassword}`);
      console.log(`   Email: ${adminEmail}`);
      console.log(`   ⚠️  Please change this password after first login!`);
    } else {
      console.log(`ℹ️  Admin user "${adminUsername}" already exists, skipping creation.`);
    }

    console.log('\n📁 Creating default categories...');

    const defaultCategories = [
      { name: 'Technology', slug: 'technology', description: 'Advancements in plasma gasification and waste-to-energy technology' },
      { name: 'Environment', slug: 'environment', description: 'Environmental impact and sustainability initiatives' },
      { name: 'Updates', slug: 'updates', description: 'Company news, milestones, and announcements' },
      { name: 'News', slug: 'news', description: 'Industry news and regulatory updates' }
    ];

    for (const category of defaultCategories) {
      const categoryCheck = await client.query(
        'SELECT id FROM blog_categories WHERE slug = $1',
        [category.slug]
      );

      if (categoryCheck.rows.length === 0) {
        await client.query(
          `INSERT INTO blog_categories (name, slug, description)
           VALUES ($1, $2, $3)`,
          [category.name, category.slug, category.description]
        );
        console.log(`✅ Created category: ${category.name}`);
      } else {
        console.log(`ℹ️  Category "${category.name}" already exists, skipping creation.`);
      }
    }

    await client.query('COMMIT');

    console.log('\n✅ Database setup completed successfully!');
    console.log('\n🚀 You can now start the application with: npm start');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase().catch(err => {
  console.error('Failed to setup database:', err);
  process.exit(1);
});
