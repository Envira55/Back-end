# Install dependencies
npm install

# Create .env file with your configuration
cp .env.example .env

# Seed the database with initial data
node seed.js

# Start development server
npm run dev

# Start production server
npm start