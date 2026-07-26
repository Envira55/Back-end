const Test = require('../models/Test');

exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find({ isActive: true }).sort({ category: 1, name: 1 });
    res.json({
      success: true,
      count: tests.length,
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tests',
      error: error.message
    });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    res.json({
      success: true,
      data: test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching test',
      error: error.message
    });
  }
};

exports.createTest = async (req, res) => {
  try {
    const test = await Test.create(req.body);
    res.status(201).json({
      success: true,
      data: test
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating test',
      error: error.message
    });
  }
};

exports.updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    res.json({
      success: true,
      data: test
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating test',
      error: error.message
    });
  }
};

exports.updateTestPrice = async (req, res) => {
  try {
    const { price } = req.body;
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      { price, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    res.json({
      success: true,
      data: test,
      message: 'Price updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating price',
      error: error.message
    });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Test deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting test',
      error: error.message
    });
  }
};

exports.getTestsByCategory = async (req, res) => {
  try {
    const tests = await Test.find({ 
      category: req.params.category,
      isActive: true 
    });
    
    res.json({
      success: true,
      count: tests.length,
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tests by category',
      error: error.message
    });
  }
};