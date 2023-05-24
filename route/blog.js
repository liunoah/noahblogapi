const express = require('express');
const router = express.Router();
const db = require('../tool/db');


// 获取所有博客文章
router.get('/', async (req, res) => {
    try {
      const page = req.query.page || 1; // 获取当前页数，默认为第一页
      const limit = req.query.limit || 10; // 获取每页显示的文章数，默认为10
      const offset = (page - 1) * limit; // 计算偏移量
  
      const countSql = 'SELECT COUNT(*) as count FROM blogdata'; // 查询文章总数
      const countResult = await db.execute(countSql);
      const totalCount = countResult[0].count; // 文章总数
  
      const sql = `SELECT * FROM blogdata ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`; // 查询当前页的文章

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
    const page = req.query.page || 1; // 获取当前页数，默认为第一页
    const limit = req.query.limit || 10; // 获取每页显示的文章数，默认为10
    const { keyword } = req.params;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const sql = `SELECT * FROM blogdata WHERE title LIKE '%${keyword}%' OR text LIKE '%${keyword}%' ORDER BY updated_at DESC LIMIT ${limit} OFFSET ${offset}`;
    // console.log(sql);
    const blogs = await db.execute(sql);
    res.json({blogs});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
// 添加评论
router.post('/comments', async (req, res) => {
  const { article_id, name, comment } = req.body;
  
  try {
    const sql = `INSERT INTO comment (article_id, name, comment) VALUES (${article_id}, '${name}', '${comment}')`
    console.log(sql);
    const blogs = await db.execute(sql);
    // res.json({blogs});
    res.status(200).json({ message: 'Comment added successfully',data:blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// 通过article_id 获取用户评论
router.get('/comments/:article_id', async (req, res) => {
  const { article_id } = req.params;

  try {
      const sql = `SELECT * FROM comment WHERE article_id=${article_id}`
      const blogs = await db.execute(sql);
  
    res.status(200).json({blogs});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// 通过article_id 获取用户评论总数
router.get('/comments/count/:article_id', async (req, res) => {
  const { article_id } = req.params;

  try {
    const sql = `SELECT count(*) as sum FROM comment WHERE article_id=${article_id}`
    const count = await db.execute(sql);
    console.log(count);
    res.json(count[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//根据comment id 删除评论
router.delete('/comments/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const sql = `DELETE FROM comment WHERE id=${id}`;
    const result = await db.execute(sql);
    console.log(result);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;