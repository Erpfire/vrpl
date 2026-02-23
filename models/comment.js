const { getPool } = require('../config/database');

class Comment {
  static async findByPostId(postId, approvedOnly = true) {
    const result = await getPool().query(`
      SELECT * FROM blog_comments
      WHERE post_id = $1 ${approvedOnly ? 'AND approved = true' : ''}
      ORDER BY created_at DESC
    `, [postId]);
    return result.rows;
  }

  static async findAllPending() {
    const result = await getPool().query(`
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
    const result = await getPool().query(`
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

  static async findPendingWithPagination({ limit, offset, postId, dateFrom, dateTo, search }) {
    let conditions = ['c.approved = false'];
    const params = [];
    let paramIndex = 1;

    if (postId) {
      conditions.push(`c.post_id = $${paramIndex}`);
      params.push(postId);
      paramIndex++;
    }

    if (dateFrom) {
      conditions.push(`c.created_at >= $${paramIndex}`);
      params.push(dateFrom);
      paramIndex++;
    }

    if (dateTo) {
      conditions.push(`c.created_at <= $${paramIndex}`);
      params.push(dateTo + ' 23:59:59');
      paramIndex++;
    }

    if (search) {
      conditions.push(`(
        LOWER(c.name) LIKE LOWER($${paramIndex}) OR
        LOWER(c.email) LIKE LOWER($${paramIndex}) OR
        LOWER(c.comment) LIKE LOWER($${paramIndex})
      )`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(*) as total, COUNT(*) as pending_count
      FROM blog_comments c
      ${whereClause}
    `;
    const countResult = await getPool().query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);
    const pendingCount = parseInt(countResult.rows[0].pending_count);

    const dataQuery = `
      SELECT
        c.*,
        bp.title as post_title,
        bp.slug as post_slug
      FROM blog_comments c
      JOIN blog_posts bp ON c.post_id = bp.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);
    const result = await getPool().query(dataQuery, params);

    return {
      comments: result.rows,
      total,
      pendingCount
    };
  }

  static async findApprovedWithPagination({ limit, offset, postId, dateFrom, dateTo, search }) {
    let conditions = ['c.approved = true'];
    const params = [];
    let paramIndex = 1;

    if (postId) {
      conditions.push(`c.post_id = $${paramIndex}`);
      params.push(postId);
      paramIndex++;
    }

    if (dateFrom) {
      conditions.push(`c.created_at >= $${paramIndex}`);
      params.push(dateFrom);
      paramIndex++;
    }

    if (dateTo) {
      conditions.push(`c.created_at <= $${paramIndex}`);
      params.push(dateTo + ' 23:59:59');
      paramIndex++;
    }

    if (search) {
      conditions.push(`(
        LOWER(c.name) LIKE LOWER($${paramIndex}) OR
        LOWER(c.email) LIKE LOWER($${paramIndex}) OR
        LOWER(c.comment) LIKE LOWER($${paramIndex})
      )`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(*) as total, COUNT(*) as approved_count
      FROM blog_comments c
      ${whereClause}
    `;
    const countResult = await getPool().query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);
    const approvedCount = parseInt(countResult.rows[0].approved_count);

    const dataQuery = `
      SELECT
        c.*,
        bp.title as post_title,
        bp.slug as post_slug
      FROM blog_comments c
      JOIN blog_posts bp ON c.post_id = bp.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);
    const result = await getPool().query(dataQuery, params);

    return {
      comments: result.rows,
      total,
      approvedCount
    };
  }

  static async create(commentData) {
    const { post_id, name, email, comment } = commentData;
    const result = await getPool().query(
      'INSERT INTO blog_comments (post_id, name, email, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [post_id, name, email, comment]
    );
    return result.rows[0];
  }

  static async approve(id) {
    const result = await getPool().query(
      'UPDATE blog_comments SET approved = true WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  static async unapprove(id) {
    const result = await getPool().query(
      'UPDATE blog_comments SET approved = false WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await getPool().query(
      'DELETE FROM blog_comments WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  static async getPendingCount() {
    const result = await getPool().query(
      'SELECT COUNT(*) as count FROM blog_comments WHERE approved = false'
    );
    return parseInt(result.rows[0].count);
  }
}

module.exports = Comment;
