// MongoDB Atlas Connection Test Script
require('dotenv').config();
const mongoose = require('mongoose');

// Test MongoDB Atlas connection
async function testConnection() {
  console.log('🧪 Testing MongoDB Atlas connection...\n');
  
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.error('❌ No MONGO_URI found in environment variables');
    console.log('📝 Please create a .env file with your MongoDB Atlas connection string');
    process.exit(1);
  }
  
  console.log('🔗 Connection string:', mongoUri.replace(/\/\/.*@/, '//***:***@'));
  
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);
    console.log(`⚡ Ready State: ${mongoose.connection.readyState}`);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📁 Collections found: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('📋 Collections:');
      collections.forEach(col => console.log(`   - ${col.name}`));
    }
    
    console.log('\n🎉 MongoDB Atlas connection test successful!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔐 Authentication Error:');
      console.log('   - Check your username and password');
      console.log('   - Make sure the database user exists');
    } else if (error.message.includes('network')) {
      console.log('\n🌐 Network Error:');
      console.log('   - Check your IP whitelist in MongoDB Atlas');
      console.log('   - Verify your connection string');
    } else if (error.message.includes('timeout')) {
      console.log('\n⏰ Timeout Error:');
      console.log('   - Check your internet connection');
      console.log('   - Verify the cluster is running');
    }
    
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the test
testConnection();
