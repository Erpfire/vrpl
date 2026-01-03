const pool = require('../config/database');
const slugify = require('slugify');

class Blog {
  static async findAll(options = {}) {
    const { columns = ['*'], publishedOnly = true, orderBy = 'published_at', limit, offset } = options;

    const validColumns = ['id', 'title', 'slug', 'excerpt', 'cover_image', 'tags', 'featured', 'created_at', 'published_at', 'view_count', 'category_name', 'category_slug', 'published'];
    const selectColumns = columns.some(c => c === '*')
      ? `
        SELECT
          bp.id,
          bp.title,
          bp.slug,
          bp.excerpt,
          bp.cover_image,
          bp.tags,
          bp.featured,
          bp.created_at,
          bp.published_at,
          bp.view_count,
          bp.published,
          bc.name as category_name,
          bc.slug as category_slug
        FROM blog_posts bp
        LEFT JOIN blog_categories bc ON bp.category_id = bc.id`
      : `SELECT ${columns.join(', ')} FROM blog_posts`;

    const whereClause = publishedOnly ? 'WHERE published = true' : '';
    const orderClause = `ORDER BY ${orderBy} DESC`;
    const limitClause = limit ? `LIMIT $1 OFFSET $2` : '';

    const query = `${selectColumns}
      ${whereClause}
      ${orderClause}
      ${limitClause}
    `;

    const result = limit ? await pool.query(query, [limit, offset]) : await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(`
      SELECT
        bp.*,
        bc.name as category_name,
        bc.slug as category_slug
      FROM blog_posts bp
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      WHERE bp.id = $1
    `, [id]);
    return result.rows[0];
  }

  static async findBySlug(slug) {
    const result = await pool.query(`
      SELECT
        bp.*,
        bc.name as category_name,
        bc.slug as category_slug
      FROM blog_posts bp
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      WHERE bp.slug = $1
    `, [slug]);
    return result.rows[0];
  }

  static async findAllAdmin(includeDrafts = true) {
    const result = await pool.query(`
      SELECT
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.cover_image,
        bp.published,
        bp.featured,
        bp.created_at,
        bp.published_at,
        bp.view_count,
        bc.name as category_name
      FROM blog_posts bp
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      ${includeDrafts ? '' : 'WHERE bp.published = true'}
      ORDER BY bp.created_at DESC
    `);
    return result.rows;
  }

  static async findByCategory(categorySlug, limit = 10, offset = 0) {
    const result = await pool.query(`
      SELECT
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.cover_image,
        bp.tags,
        bp.created_at,
        bp.published_at,
        bc.name as category_name
      FROM blog_posts bp
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      WHERE bc.slug = $1 AND bp.published = true
      ORDER BY bp.published_at DESC
      LIMIT $2 OFFSET $3
    `, [categorySlug, limit, offset]);
    return result.rows;
  }

  static async findByTag(tag, limit = 10, offset = 0) {
    const result = await pool.query(`
      SELECT
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.cover_image,
        bp.tags,
        bp.created_at,
        bp.published_at
      FROM blog_posts bp
      WHERE $1 = ANY(bp.tags) AND bp.published = true
      ORDER BY bp.published_at DESC
      LIMIT $2 OFFSET $3
    `, [tag, limit, offset]);
    return result.rows;
  }

  static async search(query, limit = 10, offset = 0) {
    const searchQuery = `%${query}%`;
    const result = await pool.query(`
      SELECT
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.cover_image,
        bp.tags,
        bp.created_at,
        bp.published_at
      FROM blog_posts bp
      WHERE bp.published = true
        AND (bp.title ILIKE $1 OR bp.content ILIKE $1 OR $2 = ANY(bp.tags))
      ORDER BY bp.published_at DESC
      LIMIT $3 OFFSET $4
    `, [searchQuery, query, limit, offset]);
    return result.rows;
  }

  static async getFeatured() {
    const result = await pool.query(`
      SELECT
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.cover_image,
        bp.tags,
        bp.created_at,
        bp.published_at,
        bc.name as category_name
      FROM blog_posts bp
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      WHERE bp.featured = true AND bp.published = true
      ORDER BY bp.published_at DESC
      LIMIT 1
    `);
    return result.rows[0];
  }

  static async create(postData) {
    const {
      title,
      slug,
      excerpt,
      content,
      cover_image,
      category_id,
      tags,
      featured,
      published,
      author_id
    } = postData;

    const publishedAt = published ? new Date() : null;

    const result = await pool.query(`
      INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, category_id, tags, featured, published, author_id, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [title, slug, excerpt, content, cover_image, category_id, tags, featured, published, author_id, publishedAt]);

    return result.rows[0];
  }

  static async update(id, postData) {
    const {
      title,
      slug,
      excerpt,
      content,
      cover_image,
      category_id,
      tags,
      featured,
      published
    } = postData;

    const result = await pool.query(`
      UPDATE blog_posts
      SET title = $1,
          slug = $2,
          excerpt = $3,
          content = $4,
          cover_image = COALESCE($5, cover_image),
          category_id = $6,
          tags = $7,
          featured = $8,
          published = $9,
          published_at = CASE WHEN $9 = true AND published_at IS NULL THEN CURRENT_TIMESTAMP ELSE published_at END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `, [title, slug, excerpt, content, cover_image, category_id, tags, featured, published, id]);

    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM blog_posts WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  static async incrementViewCount(id) {
    await pool.query(
      'UPDATE blog_posts SET view_count = view_count + 1 WHERE id = $1',
      [id]
    );
  }

  static async getTotalCount() {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM blog_posts WHERE published = true'
    );
    return parseInt(result.rows[0].count);
  }

  static generateSlug(title) {
    return slugify(title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }
}

module.exports = Blog;
