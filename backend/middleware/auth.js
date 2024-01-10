const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
  const splitToken = token.split(' ')[1];
    jwt.verify(splitToken, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        // console.error('JWT Verification Error:', err);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
  
      // You can now access the user information in the request
      req.user = decoded;
  
      // Continue with the next middleware or route handler
      next();
    });
  
};

module.exports = authenticateUser;
