const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

const accessKeyAuth = (req, res, next) => {
  const accessKey = req.header('X-Admin-Key') || req.body.accessKey;
  
  if (accessKey === process.env.ADMIN_DEFAULT_KEY) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Invalid admin access key'
    });
  }
};

module.exports = { adminAuth, accessKeyAuth };