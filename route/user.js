const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const db = require('../tool/db');
const jwt = require('jsonwebtoken');

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// 在登录路由处理程序中使用 hashPassword() 函数对密码进行哈希处理
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // const hashedPassword = await hashPassword(password); // 对密码进行哈希处理
  const sql = 'SELECT * FROM users WHERE username = ?';
  const user = await db.execute(sql, [username]);
  if (user.length === 1) {
    const result = await bcrypt.compare(password, user[0].password);
    
    if (result) {
      // const token = jwt.sign({ username }, 'secret');
      const token = jwt.sign({ username }, 'secret', { expiresIn: '10d' }); // 设置令牌的有效期为30分钟
      res.json({ token });
    } else {
      res.status(401).send('Authentication failed');
    }
  } else {
    res.status(401).send('Authentication failed');
  }
});
// 注册
// router.post('/register', async (req, res) => {
//     const { username, password, nickname } = req.body;
//     const hashedPassword = await hashPassword(password);  // 对密码进行哈希处理
//     const sql = 'INSERT INTO users (username, password, nickname) VALUES (?, ?, ?)';
//     try {
//       const result = await db.execute(sql, [username, hashedPassword, nickname]);
//       res.json({ message: 'User registered successfully' });
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Server Error');
//     }
//   });

  module.exports = router;