const jwt = require('jsonwebtoken');
// JWT 验证中间件
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader
    if (!token) {
      return res.status(401).send("authorization fail");
    }
    jwt.verify(token, 'secret', (err, user) => {
      if (err) {
        
        return  res.status(403).send("authorization fail");
      }
      req.user = user;
      next();
    });
}
module.exports = authenticateToken