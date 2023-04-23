const express = require('express');
const router = express.Router();
const db = require('./db');

// 获取所有博客文章
router.get('/', async (req, res) => {
    try {
      const page = req.query.page || 1; // 获取当前页数，默认为第一页
      const limit = req.query.limit || 10; // 获取每页显示的文章数，默认为10
      const offset = (page - 1) * limit; // 计算偏移量
  
      const countSql = 'SELECT COUNT(*) as count FROM blogdata'; // 查询文章总数
      const countResult = await db.execute(countSql);
      const totalCount = countResult[0].count; // 文章总数
  
      const sql = `SELECT * FROM blogdata LIMIT ${limit} OFFSET ${offset}`; // 查询当前页的文章
      const blogs = await db.execute(sql);
  
      const totalPages = Math.ceil(totalCount / limit); // 计算总页数
  
      res.json({ blogs, totalPages });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

// 获取单个博客文章
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'SELECT * FROM blogdata WHERE id = ?';
    const blog = await db.execute(sql, [id]);
    if (blog.length === 0) {
      res.status(404).send('Blog not found');
    } else {
      res.json(blog[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 创建博客文章
router.post('/', async (req, res) => {
  try {
    const { title, text } = req.body;
    const sql = 'INSERT INTO blogdata (title, text) VALUES (?, ?)';
    await db.execute(sql, [title, text]);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 更新博客文章
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, text } = req.body;
    const sql = 'UPDATE blogdata SET title = ?, text = ? WHERE id = ?';
    const result = await db.execute(sql, [title, text, id]);
    if (result.affectedRows === 0) {
      res.status(404).send('Blog not found');
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 删除博客文章
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'DELETE FROM blogdata WHERE id = ?';
    const result = await db.execute(sql, [id]);
    if (result.affectedRows === 0) {
      res.status(404).send('Blog not found');
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 搜索博客文章
router.get('/search/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    const sql = 'SELECT * FROM blogdata WHERE title LIKE ? OR text LIKE ?';
    const blogs = await db.execute(sql, [`%${keyword}%`, `%${keyword}%`]);
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;