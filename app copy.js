const express = require('express');
const cors = require('cors');
const blogsRouter = require('./blog');

const bodyParser = require('body-parser');

const app = express();

// 设置请求体大小限制为10MB
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: '*',
}));  
app.use(express.json());
app.use('/blogs', blogsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));