const mysql = require('mysql2/promise');
// 读取配置文件
const config = require('config');


const pool = mysql.createPool(config.get('database'));

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