const Report = require('../models/Report');

exports.createReport = async (req, res) => {
  try {
    const report = await Report.create(req.body);
    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating report',
      error: error.message
    });
  }
};

exports.getPatientReport = async (req, res) => {
  try {
    const { patientId, patientName } = req.query;
    
    if (!patientId || !patientName) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID and name are required'
      });
    }

    const reports = await Report.find({
      patientId: patientId,
      patientName: { $regex: new RegExp(patientName, 'i') }
    }).sort({ createdAt: -1 });

    if (reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No reports found for this patient'
      });
    }

    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching patient reports',
      error: error.message
    });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { 
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        updatedAt: Date.now() 
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating report',
      error: error.message
    });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Report.countDocuments(filter);

    res.json({
      success: true,
      data: reports,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message
    });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching report',
      error: error.message
    });
  }
};