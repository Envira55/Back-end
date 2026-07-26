exports.handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    const Test = require('../models/Test');
    
    let reply = '';
    const msg = message.toLowerCase();

    // Pattern matching for common queries
    if (msg.includes('price') || msg.includes('cost') || msg.includes('rate')) {
      const testName = msg.replace(/price|cost|rate|of|for|the/gi, '').trim();
      if (testName) {
        const test = await Test.findOne({ 
          name: { $regex: new RegExp(testName, 'i') },
          isActive: true 
        });
        if (test) {
          reply = `The price for ${test.name} is ₹${test.price}.`;
        } else {
          reply = 'I couldn\'t find that test. Please check our test list or call us.';
        }
      } else {
        const tests = await Test.find({ isActive: true }).limit(5);
        reply = 'Here are some test prices: ' + 
          tests.map(t => `${t.name}: ₹${t.price}`).join(', ');
      }
    } else if (msg.includes('report') || msg.includes('status')) {
      reply = 'To check your report, please provide your Patient ID and Name in the Report section.';
    } else if (msg.includes('address') || msg.includes('location')) {
      reply = 'We are located at Mall road near Tomar Cold Storage, Atrauli (Hardoi), Uttar Pradesh 241204.';
    } else if (msg.includes('phone') || msg.includes('contact') || msg.includes('call')) {
      reply = 'You can reach us at 9278484337 or 8381983437.';
    } else if (msg.includes('book') || msg.includes('appointment')) {
      reply = 'To book a test, please call us or visit our centre. You can also fill the contact form.';
    } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      reply = 'Hello! Welcome to ENVIRA Diagnostic Centre. How can I help you today?';
    } else {
      reply = 'I can help you with test prices, report status, our address, or booking information. What would you like to know?';
    }

    res.json({
      success: true,
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Chatbot error',
      error: error.message
    });
  }
};

exports.getFrequentQuestions = (req, res) => {
  res.json({
    success: true,
    data: [
      { question: 'How to check my report?', answer: 'Enter your Patient ID and Name in the Report section.' },
      { question: 'What are your working hours?', answer: 'We are open Monday to Saturday, 8 AM to 8 PM.' },
      { question: 'Do you provide home collection?', answer: 'Yes, home collection is available. Call us to schedule.' },
      { question: 'How long for test results?', answer: 'Most tests are ready within 24 hours.' }
    ]
  });
};