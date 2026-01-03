const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://vrpl_user:vrpl_password_123@localhost:5432/vrpl_db'
});

async function checkDatabase() {
  try {
    console.log('Checking VRPL database...\n');

    const postsResult = await pool.query('SELECT COUNT(*) as count FROM blog_posts');
    console.log(`Blog Posts: ${postsResult.rows[0].count}`);

    const publishedResult = await pool.query("SELECT COUNT(*) as count FROM blog_posts WHERE published = true");
    console.log(`Published Posts: ${publishedResult.rows[0].count}`);

    const draftsResult = await pool.query("SELECT COUNT(*) as count FROM blog_posts WHERE published = false");
    console.log(`Draft Posts: ${draftsResult.rows[0].count}`);

    const commentsResult = await pool.query('SELECT COUNT(*) as count FROM blog_comments');
    console.log(`Comments: ${commentsResult.rows[0].count}`);

    const approvedCommentsResult = await pool.query("SELECT COUNT(*) as count FROM blog_comments WHERE approved = true");
    console.log(`Approved Comments: ${approvedCommentsResult.rows[0].count}`);

    const pendingCommentsResult = await pool.query("SELECT COUNT(*) as count FROM blog_comments WHERE approved = false");
    console.log(`Pending Comments: ${pendingCommentsResult.rows[0].count}`);

    console.log('\n--- Recent Blog Posts ---');
    const recentPosts = await pool.query(`
      SELECT id, title, slug, published, view_count, created_at
      FROM blog_posts
      ORDER BY created_at DESC
      LIMIT 10
    `);

    if (recentPosts.rows.length === 0) {
      console.log('No blog posts found in database.');
    } else {
      recentPosts.rows.forEach(post => {
        const status = post.published ? '✅ Published' : '📝 Draft';
        console.log(`[${post.id}] ${post.title}`);
        console.log(`    Slug: ${post.slug} | Views: ${post.view_count} | ${status}`);
        console.log(`    Created: ${post.created_at}`);
        console.log('');
      });
    }

    await pool.end();
    console.log('Database check complete.');

  } catch (error) {
    console.error('Error checking database:', error.message);
    console.log('\nMake sure:');
    console.log('1. The database server is running');
    console.log('2. Environment variables are set correctly');
    console.log('3. The init-db.sql script has been run');
    await pool.end();
  }
}

checkDatabase();
