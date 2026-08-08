const mongoose = require('mongoose');
const dns = require('dns');

// Configure DNS fallback for reliable mongodb+srv SRV record resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if custom DNS servers are restricted
}

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI;

    if (!connUri) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }

    // Extract host name for logging without exposing credentials
    let hostInfo = 'Unknown Host';
    try {
      if (connUri.includes('@')) {
        hostInfo = connUri.split('@')[1].split('/')[0];
      } else {
        const parsed = new URL(connUri);
        hostInfo = parsed.host || parsed.pathname;
      }
    } catch (e) {
      hostInfo = connUri.replace(/^mongodb(\+srv)?:\/\/[^@]+@/, '');
    }

    console.log(`Connecting to MongoDB... Host: ${hostInfo}`);

    const conn = await mongoose.connect(connUri);
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Tip: Make sure MONGODB_URI is properly formatted and valid.');
    process.exit(1);
  }
};

module.exports = connectDB;
