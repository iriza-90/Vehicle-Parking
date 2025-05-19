const jwt = require('jsonwebtoken');

module.exports = {
  verifyToken: (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // decoded = { id: user.id }
      next();
    } catch (err) {
      console.error('Token verification failed:', err);
      res.status(401).json({ error: 'Invalid token' });
    }
  }
};