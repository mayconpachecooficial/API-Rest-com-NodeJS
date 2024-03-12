const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  
  let token = req.headers['authorization']; 
  if (!token) {
    return res.status(403).send({ message: 'Um token é necessário para autenticação' });
  }

  try {
    
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length); 
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({ message: 'Token inválido' });
  }

  return next();
};

module.exports = verifyToken;
