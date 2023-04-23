const express = require('express');
const app = express();
const blogsRouter = require('./blog');

app.use(express.json());
app.use('/blogs', blogsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));