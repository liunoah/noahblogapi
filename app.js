const express = require('express');
const cors = require('cors');
const app = express();
const blogsRouter = require('./blog');
app.use(cors({
    origin: '*',
}));  
app.use(express.json());
app.use('/blogs', blogsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));