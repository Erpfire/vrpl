const pool = require('../config/database');

class Comment {
  static async findByPostId(postId, approvedOnly = true) {
    const result = await pool.query(`
      SELECT * FROM blog_comments
      WHERE post_id = $1 ${approvedOnly ? 'AND approved = true' : ''}
      ORDER BY created_at DESC
    `, [postId]);
    return result.rows;
  }

  static async findAllPending() {
    const result = await pool.query(`
      SELECT
        c.*,
        bp.title as post_title,
        bp.slug as post_slug
      FROM blog_comments c
      JOIN blog_posts bp ON c.post_id = bp.id
      WHERE c.approved = false
      ORDER BY c.created_at DESC
    `);
    return result.rows;
  }

  static async findAllApproved() {
    const result = await pool.query(`
      SELECT
        c.*,
        bp.title as post_title,
        bp.slug as post_slug
      FROM blog_comments c
      JOIN blog_posts bp ON c.post_id = bp.id
      WHERE c.approved = true
      ORDER BY c.created_at DESC
    `);
    return result.rows;
  }

  static async create(commentData) {
    const { post_id, name, email, comment } = commentData;
    const result = await pool.query(
      'INSERT INTO blog_comments (post_id, name, email, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [post_id, name, email, comment]
    );
    return result.rows[0];
  }

  static async approve(id) {
    const result = await pool.query(
      'UPDATE blog_comments SET approved = true WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  static async unapprove(id) {
    const result = await pool.query(
      'UPDATE blog_comments SET approved = false WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM blog_comments WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  static async getPendingCount() {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM blog_comments WHERE approved = false'
    );
    return parseInt(result.rows[0].count);
  }
}

module.exports = Comment;
