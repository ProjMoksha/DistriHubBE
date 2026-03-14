const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DistriHub Backend API',
      version: '1.0.0',
      description: 'Distribution Business Management Platform Backend API',
      contact: {
        name: 'DistriHub Team',
        email: 'support@distrihub.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            error: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
        Business: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            legalBusinessName: { type: 'string' },
            gstNumber: { type: 'string' },
            businessType: { type: 'string' },
            distributorCode: { type: 'string' },
            isCompleted: { type: 'boolean' },
          },
        },
      },
    },
  },
  apis: [
    './src/routes/authRoutes.js',
    './src/routes/businessRoutes.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
