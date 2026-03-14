# DistriHubBE Project Instructions

## Project Overview
DistriHubBE is a production-grade Node.js/Express backend for a distribution business management platform. It supports 4-step business registration, JWT authentication, file uploads to Cloudinary, and comprehensive error handling.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **ODM**: Mongoose
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **File Upload**: Multer
- **Validation**: Joi
- **Password Hashing**: Bcrypt
- **Logging**: Morgan
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest, Supertest
- **API Documentation**: Swagger/OpenAPI

## Project Structure
```
src/
├── config/          - Database and Cloudinary configuration
├── controllers/     - Request handlers (auth, business)
├── models/          - Mongoose schemas (User, Business)
├── routes/          - API route definitions
├── services/        - Business logic and operations
├── middleware/      - Auth, validation, error handling, uploads
├── validations/     - Joi validation schemas
├── utils/           - Helper classes (ApiResponse, AppError)
├── constants/       - Regex patterns and constants
├── swagger/         - API documentation spec
└── app.js          - Express app setup
tests/
├── unit/            - Unit tests for utilities and services
└── integration/     - Integration tests for API flows
```

## Key Files
- `package.json` - Dependencies and scripts
- `server.js` - Entry point, starts server and connects DB
- `src/app.js` - Express app with middleware and routes
- `src/models/Business.js` - Business schema with all 4-step fields
- `src/services/businessService.js` - Contains distributor code generation
- `.env.example` - Template for environment variables

## Development Workflow

### Setup
1. Clone repository
2. `npm install` - Install dependencies
3. Create `.env` file from `.env.example`
4. Configure MongoDB Atlas connection string
5. Configure Cloudinary credentials
6. `npm run dev` - Start server in development mode

### Running Tests
- `npm test` - Run all tests
- `npm run test:watch` - Watch mode
- `npm run test:coverage` - Coverage report

### API Documentation
- Interactive Swagger UI at `http://localhost:5000/api-docs`
- All endpoints include request/response examples

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `DELETE /api/auth/profile` - Delete user profile (protected)

### Business Registration (4 Steps)
- `POST /api/business/step1` - Create business basic details
- `GET /api/business/step1/:id` - Get business basic details
- `PUT /api/business/step1/:id` - Update business basic details
- `DELETE /api/business/step1/:id` - Delete business basic details
- `POST /api/business/step2` - Create document details (with file upload)
- `GET /api/business/step2/:id` - Get document details
- `PUT /api/business/step2/:id` - Update document details
- `DELETE /api/business/step2/:id` - Delete document details
- `POST /api/business/step3` - Create warehouse details
- `GET /api/business/step3/:id` - Get warehouse details
- `PUT /api/business/step3/:id` - Update warehouse details
- `DELETE /api/business/step3/:id` - Delete warehouse details
- `POST /api/business/step4` - Complete registration & generate code

## Standard Response Format

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "error": null
}
```

### Error
```json
{
  "success": false,
  "message": "Validation error",
  "data": null,
  "error": "Error details"
}
```

## Important Features

### Distributor Code Generation
- Format: `DIST` + 4 random digits (e.g., `DIST4831`)
- Generated in Step 4 when business registration is complete
- Guaranteed unique - checked against database
- Persisted in Business collection

### File Upload Flow
1. Client sends file via multipart/form-data
2. Multer receives and validates file (image types only)
3. File uploaded to Cloudinary via buffer
4. Cloudinary returns URL and publicId
5. Stored in MongoDB

### Authentication
- JWT tokens with 1-hour expiration
- Token passed as `Authorization: Bearer <token>` header
- Automatic verification on protected routes

### Input Validation
- GST format validation: `[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}`
- PAN format validation: `[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}`
- Phone: 10 digits starting with 6-9
- Email: Standard email format
- Pincode: 6 digits
- Password: Min 8 chars, uppercase, lowercase, number, special char

## Database Considerations

### Indexes
- User: `email` (unique, indexed)
- Business: `userId`, `gstNumber` (unique), `distributorCode` (unique)

### Schema Versioning
- Fields are optional during registration (can be filled step by step)
- No field dropping - only additions and modifications
- Empty fields are null/undefined

### Connection Management
- MongoDB Atlas free tier allows up to 3 concurrent connections
- Connection retries are handled automatically

## Common Tasks

### Adding a New API Endpoint
1. Create controller function in appropriate controller
2. Wrap with `asyncWrapper` for error handling
3. Add Joi validation schema if needed
4. Create route in appropriate routes file
5. Apply middleware (authenticate, validate, upload)
6. Add tests in `tests/integration/`

### Modifying Business Schema
1. Update schema in `src/models/Business.js`
2. Add field migration if data exists
3. Update validation schemas if needed
4. Update service layer operations
5. Add tests for new fields

### Adding New Validations
1. Add regex pattern to `src/constants/regex.js`
2. Create Joi schema in `src/validations/`
3. Add middleware to route
4. Test with invalid/valid inputs

### Testing File Uploads
1. Use `form-data` library in tests
2. Mock Cloudinary for unit tests
3. Integration tests with actual files
4. Verify `imageURL` and `publicId` stored

## Error Handling

### AppError Class
- `AppError.validation(message)` - 400 status
- `AppError.authentication(message)` - 401 status
- `AppError.forbidden(message)` - 403 status
- `AppError.notFound(message)` - 404 status
- `AppError.conflict(message)` - 409 status
- `AppError.serverError(message)` - 500 status

### Error Middleware
- Catches all errors in error handler middleware
- Converts to standard response format
- Logs in development mode
- Returns appropriate status codes

## Security Practices

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with expiration
- ✅ Helmet security headers
- ✅ CORS configured
- ✅ Rate limiting enabled (100/15min per IP)
- ✅ Input validation with Joi
- ✅ File MIME type validation
- ✅ Cloudinary API secret stored in .env

## Deployment Notes

- Set `NODE_ENV=production` in production
- Update `JWT_SECRET` with strong random key
- Update `CORS_ORIGIN` to specific domains
- Adjust rate limits based on load
- Monitor MongoDB Atlas usage
- Monitor Cloudinary bandwidth
- Enable HTTPS in production

## Troubleshooting

### MongoDB Connection Failed
- Check connection string in `.env`
- Verify IP whitelisting in MongoDB Atlas
- Check network connectivity
- Ensure database user credentials are correct

### Cloudinary Upload Failed
- Verify API credentials in `.env`
- Check file size (max 5MB)
- Validate file MIME type
- Check Cloudinary account quota

### JWT Errors
- Verify token format (`Bearer <token>`)
- Check token expiration
- Ensure `JWT_SECRET` matches between server and token

### Tests Failing
- Clear Jest cache: `npm test -- --clearCache`
- Check MongoDB connection for integration tests
- Mock external services in unit tests
- Verify test data fixtures

## Performance Optimization

- Database indexes created on frequently queried fields
- Mongoose lean queries for read-only operations
- Pagination support can be added for list endpoints
- Compression middleware can be added
- Body size limits enforced (10MB)

## Next Steps / Backlog

- [ ] Add pagination for list endpoints
- [ ] Implement refresh token rotation
- [ ] Add role-based access control (admin/user)
- [ ] Email notifications for registration
- [ ] Analytics and metrics tracking
- [ ] API key authentication for third-party integrations
- [ ] Webhook support for external events
- [ ] GraphQL API alongside REST
- [ ] Caching layer (Redis)
- [ ] Database transaction support

---

**Last Updated**: March 2026
**Maintained By**: DistriHub Team
