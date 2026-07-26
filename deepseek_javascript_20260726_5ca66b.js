const mongoose = require('mongoose');
const Test = require('./models/Test');
const Admin = require('./models/Admin');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await Test.deleteMany({});
    await Admin.deleteMany({});

    // Seed tests
    const tests = [
      { name: 'CBC (Complete Blood Count)', category: 'Pathology', price: 250 },
      { name: 'Lipid Profile', category: 'Pathology', price: 500 },
      { name: 'Thyroid Profile', category: 'Pathology', price: 400 },
      { name: 'Liver Function Test', category: 'Pathology', price: 550 },
      { name: 'Kidney Function Test', category: 'Pathology', price: 500 },
      { name: 'ECG', category: 'ECG', price: 300 },
      { name: 'X-Ray Chest', category: 'Radiology', price: 400 },
      { name: 'Ultrasound Abdomen', category: 'Radiology', price: 800 },
      { name: 'Biopsy Small', category: 'Biopsy', price: 1200 },
      { name: 'Biopsy Large', category: 'Biopsy', price: 2000 }
    ];

    await Test.insertMany(tests);
    console.log('✅ Tests seeded successfully');

    // Seed default admin
    await Admin.create({
      username: 'admin',
      password: 'envira@2025',
      accessKey: 'envira123',
      role: 'super_admin'
    });
    console.log('✅ Admin seeded successfully');

    console.log('🌱 Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();