const pool = require('../config/database');
const slugify = require('slugify');

class Category {
  static async findAll() {
    const result = await pool.query(`
      SELECT
        c.*,
        (SELECT COUNT(*) FROM blog_posts bp WHERE bp.category_id = c.id AND bp.published = true) as post_count
      FROM blog_categories c
      ORDER BY c.name ASC
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM blog_categories WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findBySlug(slug) {
    const result = await pool.query(
      'SELECT * FROM blog_categories WHERE slug = $1',
      [slug]
    );
    return result.rows[0];
  }

  static async create(categoryData) {
    const { name, slug, description } = categoryData;
    const result = await pool.query(
      'INSERT INTO blog_categories (name, slug, description) VALUES ($1, $2, $3) RETURNING *',
      [name, slug, description]
    );
    return result.rows[0];
  }

  static async update(id, categoryData) {
    const { name, slug, description } = categoryData;
    const result = await pool.query(
      'UPDATE blog_categories SET name = $1, slug = $2, description = $3 WHERE id = $4 RETURNING *',
      [name, slug, description, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM blog_categories WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  static generateSlug(name) {
    return slugify(name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }
}

module.exports = Category;
