// blogRouter.js

const express = require('express');
const router = express.Router();
const db = require('../tool/db');

// 获取所有博客文章
router.get('/', async (req, res) => {
  try {
    const blogs = await db.execute('SELECT * FROM blogdata');
    res.json(blogs);
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

module.exports = router;