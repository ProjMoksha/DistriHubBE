const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerDefinition');

const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/appError');

/**
 * Initialize Express App
 */
const app = express();

// ==================== MIDDLEWARE ====================

// Security: Helmet
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==================== ROUTES ====================

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);

// ==================== 404 HANDLER ====================

app.use((req, res, next) => {
  throw AppError.notFound(`Route ${req.originalUrl} not found`);
});

// ==================== ERROR HANDLING ====================

// Global Error Handler (Must be last)
app.use(errorHandler);

module.exports = app;
