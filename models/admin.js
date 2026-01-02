const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class Admin {
  static async findByUsername(username) {
    const result = await pool.query(
      'SELECT id, username, password_hash, email, created_at FROM admins WHERE username = $1',
      [username]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, username, email, created_at FROM admins WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async updatePassword(id, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      `UPDATE admins
       SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [passwordHash, id]
    );
  }

  static async updateEmail(id, email) {
    await pool.query(
      `UPDATE admins
       SET email = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [email, id]
    );
  }

  static verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = Admin;
