require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { verifyCloudinaryConfig } = require('./src/config/cloudinary');

/**
 * Server Entry Point
 */

const PORT = process.env.PORT || 5000;

/**
 * Start Server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Verify Cloudinary configuration
    verifyCloudinaryConfig();

    // Start Express Server
    app.listen(PORT, () => {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
      console.log(`${'='.repeat(50)}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

/**
 * Handle Unhandled Promise Rejections
 */
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Promise Rejection:', error);
  process.exit(1);
});

/**
 * Handle Uncaught Exceptions
 */
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();
