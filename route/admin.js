const express = require('express');
const router = express.Router();
const db = require('../tool/db');




// Get all blog data
router.get('/api/blogdata', (req, res) => {
  const sql = 'SELECT * FROM blogdata';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Error executing query');
      return;
    }
    res.status(200).send(results);
  });
});

// Get a specific blog data by id
router.get('/api/blogdata/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM blogdata WHERE id = ${id}`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Error executing query');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Blog data not found');
      return;
    }
    res.status(200).send(results[0]);
  });
});

// Create a new blog data
router.post('/api/blogdata', (req, res) => {
  const { title, text } = req.body;
  const sql = `INSERT INTO blogdata (title, text) VALUES ('${title}', '${text}')`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Error executing query');
      return;
    }
    res.status(201).send({ id: result.insertId });
  });
});

// Update an existing blog data
router.put('/api/blogdata/:id', (req, res) => {
  const { id } = req.params;
  const { title, text } = req.body;
  const sql = `UPDATE blogdata SET title='${title}', text='${text}' WHERE id=${id}`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Error executing query');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Blog data not found');
      return;
    }
    res.status(200).send({ id: parseInt(id, 10) });
  });
});

// Delete an existing blog data
router.delete('/api/blogdata/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM blogdata WHERE id=${id}`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Error executing query');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Blog data not found');
      return;
    }
    res.status(204).send();
  });
});

// Get all comments for a specific blog data by id
router.get('/api/blogdata/:id/comments', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM comment WHERE article_id = ${id}`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Error executing query');
      return;
    }
    res.status(200).send(results);
  });
});

// Create a new comment for a specific blog data by id
router.post('/api/blogdata/:id/comments', (req, res) => {
  const { id } = req.params;
  const { name, comment } = req.body;
  const sql = `INSERT INTO comment (article_id, name, comment) VALUES (${id}, '${name}', '${comment}')`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Error executing query');
      return;
    }
    res.status(201).send({ id: result.insertId });
  });
});
