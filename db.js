const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'liunoah.com',
  user: 'root',
  password: 'Admin@123',
  database: 'blog',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = {
  async execute(sql, values) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(sql, values);
      return rows;
    } finally {
      connection.release();
    }
  }
};