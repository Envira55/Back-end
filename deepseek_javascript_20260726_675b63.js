const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { accessKey } = req.body;
    
    // Check simple access key first
    if (accessKey === process.env.ADMIN_DEFAULT_KEY) {
      const token = jwt.sign(
        { role: 'admin', accessKey },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return res.json({
        success: true,
        token,
        message: 'Admin access granted'
      });
    }

    // Check database admin credentials
    const { username, password } = req.body;
    if (username && password) {
      const admin = await Admin.findOne({ username, isActive: true });
      
      if (!admin || !(await admin.comparePassword(password))) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      admin.lastLogin = Date.now();
      await admin.save();

      const token = jwt.sign(
        { id: admin._id, username: admin.username, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        token,
        admin: {
          username: admin.username,
          role: admin.role
        }
      });
    }

    res.status(400).json({
      success: false,
      message: 'Access key or credentials required'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login error',
      error: error.message
    });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { username, password, accessKey } = req.body;
    
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin username already exists'
      });
    }

    const admin = await Admin.create({ username, password, accessKey });
    
    res.status(201).json({
      success: true,
      data: {
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating admin',
      error: error.message
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const Report = require('../models/Report');
    const Test = require('../models/Test');

    const [totalReports, pendingReports, totalTests, revenueStats] = await Promise.all([
      Report.countDocuments(),
      Report.countDocuments({ status: 'Pending' }),
      Test.countDocuments({ isActive: true }),
      Report.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amount' },
            paidAmount: {
              $sum: {
                $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, '$amount', 0]
              }
            }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalReports,
        pendingReports,
        totalTests,
        revenue: revenueStats[0] || { totalRevenue: 0, paidAmount: 0 }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};