const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      console.error('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
      req.user = { ...decoded, _id: decoded.id };
      if (roles.length && !roles.includes(decoded.role)) {
        console.error('Access denied for role:', decoded.role);
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    } catch (err) {
      console.error('Invalid token:', err.message);
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = auth;