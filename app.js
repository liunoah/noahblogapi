const express = require('express');
const cors = require('cors');
const blogsRouter = require('./tool/blog');
const userRouter = require('./route/user');
const authenticateToken = require('./tool/auth');

const bodyParser = require('body-parser');

const app = express();

// 读取配置文件
const config = require('config');

// 设置请求体大小限制为10MB
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: '*',
}));  
app.use(express.json());


// 需要鉴权的博客路由
app.delete('/blogs/:id', authenticateToken, blogsRouter);
app.put('/blogs/:id', authenticateToken, blogsRouter);
app.delete('/blogs/comment/:id', authenticateToken, blogsRouter);


app.use('/blogs', blogsRouter);
app.use('/blogs/user', userRouter );
// 生产环境使用5000 测试环境使用 http: 3001 https: 3004 
const PORT = process.env.PORT || config.get('port');
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));