const request = require('supertest');
const app = require('./app');

describe('GET /api/blogdata', () => {
  it('responds with json', async () => {
    const response = await request(app).get('/api/blogdata');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
  });

  it('returns an array of blog data', async () => {
    const response = await request(app).get('/api/blogdata');
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('filters blog data by keyword', async () => {
    const response = await request(app).get('/api/blogdata?keyword=test');
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body.every(blog => blog.title.toLowerCase().includes('test') || blog.text.toLowerCase().includes('test'))).toBe(true);
  });
});

describe('GET /api/blogdata/:id', () => {
  it('responds with json', async () => {
    const response = await request(app).get('/api/blogdata/1');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
  });

  it('returns the specified blog data', async () => {
    const response = await request(app).get('/api/blogdata/1');
    expect(response.body).toHaveProperty('title', 'Test Blog');
    expect(response.body).toHaveProperty('text', 'This is a test blog.');
  });

  it('returns a 404 error if the blog data does not exist', async () => {
    const response = await request(app).get('/api/blogdata/999');
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual('博客文章不存在');
  });
});

describe('POST /api/blogdata', () => {
  it('creates a new blog data', async () => {
    const response = await request(app)
      .post('/api/blogdata')
      .send({ title: 'New Blog', text: 'This is a new blog.' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
  });
});

describe('PUT /api/blogdata/:id', () => {
  it('updates the specified blog data', async () => {
    const response = await request(app)
      .put('/api/blogdata/1')
      .send({ title: 'Updated Blog', text: 'This is an updated blog.' });
    expect(response.statusCode).toBe(204);
  });

  it('returns a 404 error if the blog data does not exist', async () => {
    const response = await request(app)
      .put('/api/blogdata/999')
      .send({ title: 'Updated Blog', text: 'This is an updated blog.' });
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual('博客文章不存在');
  });
});

describe('DELETE /api/blogdata/:id', () => {
  it('deletes the specified blog data', async () => {
    const response = await request(app).delete('/api/blogdata/1');
    expect(response.statusCode).toBe(204);
  });

  it('returns a 404 error if the blog data does not exist', async () => {
    const response = await request(app).delete('/api/blogdata/999');
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual('博客文章不存在');
  });
});