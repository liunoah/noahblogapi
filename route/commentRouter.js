// commentRouter.js

const express = require('express');
const router = express.Router();
const db = require('../tool/db');

// 获取评论列表
router.get('/', async (req, res) => {
  try {
    const comments = await db.execute('SELECT * FROM comment');
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 获取单个评论
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'SELECT * FROM comment WHERE id = ?';
    const comment = await db.execute(sql, [id]);
    if (comment.length === 0) {
      res.status(404).send('Comment not found');
    } else {
      res.json(comment[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 创建评论
router.post('/', async (req, res) => {
  try {
    const { article_id, name, comment } = req.body;
    const sql = 'INSERT INTO comment (article_id, name, comment) VALUES (?, ?, ?)';
    await db.execute(sql, [article_id, name, comment]);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 更新评论
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, comment } = req.body;
    const sql = 'UPDATE comment SET name = ?, comment = ? WHERE id = ?';
    const result = await db.execute(sql, [name, comment, id]);
    if (result.affectedRows === 0) {
      res.status(404).send('Comment not found');
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 删除评论
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'DELETE FROM comment WHERE id = ?';
    const result = await db.execute(sql, [id]);
    if (result.affectedRows === 0) {
      res.status(404).send('Comment not found');
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;