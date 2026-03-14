# DistriHubBE - Distribution Business Management Platform Backend

A production-grade Node.js/Express backend for managing distribution business registration with 4-step verification, file uploads to Cloudinary, and JWT authentication.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with password hashing
- **4-Step Business Registration**:
  - Step 1: Basic business details (GST, contact info, address)
  - Step 2: Document verification with file uploads
  - Step 3: Warehouse details
  - Step 4: Automatic distributor code generation
- **File Management**: Upload and store images on Cloudinary
- **Data Validation**: Comprehensive input validation with Joi schemas
- **Error Handling**: Centralized error handling with meaningful messages
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Testing**: Jest unit and integration tests
- **Security**:
  - Helmet for HTTP headers
  - CORS configuration
  - Rate limiting
  - Password hashing with bcrypt
  - JWT token verification

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB Atlas account (free tier available)
- Cloudinary account (free tier available)

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd DistriHubBE
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Edit the `.env` file and add your configuration:

```
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/distrihub?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=1h

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new project
4. Create a new cluster (select free tier)
5. Create a database user:
   - Go to Security > Database Access
   - Click "Add New Database User"
   - Set username and password
   - Save credentials
6. Allow network access:
   - Go to Security > Network Access
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0) for development
7. Get connection string:
   - Click "Connect" on cluster
   - Select "Connect to your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
8. Paste connection string in `.env` as `MONGO_URI`

### 5. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to Dashboard
4. Copy your credentials:
   - Cloud Name
   - API Key
   - API Secret
5. Paste in `.env` file

## ▶️ Running the Server

### Development Mode (with Auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

**API Documentation**: `http://localhost:5000/api-docs`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass@123",
  "confirmPassword": "SecurePass@123"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "email": "user@example.com",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "error": null
}
```

#### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass@123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "error": null
}
```

#### Get Profile
```
GET /auth/profile
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": { ... }
  },
  "error": null
}
```

#### Update Profile
```
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newemail@example.com"
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... },
  "error": null
}
```

#### Delete Profile
```
DELETE /auth/profile
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Profile deleted successfully",
  "data": null,
  "error": null
}
```

### Business Registration Endpoints

#### Step 1: Create Basic Details
```
POST /business/step1
Authorization: Bearer <token>
Content-Type: application/json

{
  "legalBusinessName": "ABC Trading Company",
  "proprietorName": "John Doe",
  "gstNumber": "19AABCT1234H1Z0",
  "businessPhone": "9876543210",
  "businessEmail": "business@example.com",
  "addressLine1": "123 Business Street",
  "area": "Downtown",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001"
}

Response (201):
{
  "success": true,
  "message": "Step 1: Business basic details saved",
  "data": { ... },
  "error": null
}
```

#### Step 1: Get Details
```
GET /business/step1/:userId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Step 1 details retrieved",
  "data": { ... },
  "error": null
}
```

#### Step 1: Update Details
```
PUT /business/step1/:userId
Authorization: Bearer <token>
Content-Type: application/json

{ ... }

Response (200):
{
  "success": true,
  "message": "Step 1: Business basic details updated",
  "data": { ... },
  "error": null
}
```

#### Step 1: Delete Details
```
DELETE /business/step1/:userId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Step 1: Business basic details deleted",
  "data": null,
  "error": null
}
```

#### Step 2: Create Document Details (with File Upload)
```
POST /business/step2
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "businessType": "Wholesaler",
  "gstNumber": "19AABCT1234H1Z0",
  "panNumber": "AABCA1234A",
  "businessLicenceImage": <file>
}

Response (201):
{
  "success": true,
  "message": "Step 2: Business document details saved",
  "data": { ... },
  "error": null
}
```

#### Step 2: Get Details
```
GET /business/step2/:userId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Step 2 details retrieved",
  "data": { ... },
  "error": null
}
```

#### Step 2: Update Details
```
PUT /business/step2/:userId
Authorization: Bearer <token>
Content-Type: multipart/form-data

{ ... }

Response (200):
{
  "success": true,
  "message": "Step 2: Business document details updated",
  "data": { ... },
  "error": null
}
```

#### Step 3: Create Warehouse Details
```
POST /business/step3
Authorization: Bearer <token>
Content-Type: application/json

{
  "warehouseName": "Main Warehouse",
  "contactPerson": "Jane Smith",
  "fullAddress": "456 Warehouse Road, Industrial Area, Mumbai",
  "warehouseCity": "Mumbai",
  "warehousePincode": "400051",
  "locationMapAddress": "https://maps.example.com/location"
}

Response (201):
{
  "success": true,
  "message": "Step 3: Warehouse details saved",
  "data": { ... },
  "error": null
}
```

#### Step 3: Get Details
```
GET /business/step3/:userId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Step 3 details retrieved",
  "data": { ... },
  "error": null
}
```

#### Step 3: Update Details
```
PUT /business/step3/:userId
Authorization: Bearer <token>
Content-Type: application/json

{ ... }

Response (200):
{
  "success": true,
  "message": "Step 3: Warehouse details updated",
  "data": { ... },
  "error": null
}
```

#### Step 4: Complete Registration & Generate Distributor Code
```
POST /business/step4
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Registration completed! Your distributor code has been generated.",
  "data": {
    "business": { ... },
    "distributorCode": "DIST4831"
  },
  "error": null
}
```

## 🧪 Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## 📦 Project Structure

```
DistriHubBE/
├── src/
│   ├── config/              # Configuration files
│   │   ├── db.js           # MongoDB connection
│   │   └── cloudinary.js   # Cloudinary setup
│   ├── controllers/         # Request handlers
│   │   ├── authController.js
│   │   └── businessController.js
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   └── Business.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   └── businessRoutes.js
│   ├── services/            # Business logic
│   │   ├── authService.js
│   │   ├── businessService.js
│   │   └── fileService.js
│   ├── middleware/          # Custom middleware
│   │   ├── authenticate.js
│   │   ├── errorHandler.js
│   │   ├── validateRequest.js
│   │   ├── asyncWrapper.js
│   │   └── uploadMiddleware.js
│   ├── validations/         # Joi schemas
│   │   ├── authValidation.js
│   │   └── businessValidation.js
│   ├── utils/               # Utility files
│   │   ├── apiResponse.js
│   │   └── appError.js
│   ├── constants/           # Constants
│   │   └── regex.js
│   ├── swagger/             # API documentation
│   │   └── swaggerDefinition.js
│   └── app.js               # Express app setup
├── tests/                   # Test files
│   ├── unit/
│   │   ├── utils/
│   │   └── services/
│   └── integration/
├── uploads/                 # Local uploads (temporary)
├── .env.example             # Env variables template
├── .gitignore              # Git ignore rules
├── jest.config.js          # Jest configuration
├── package.json            # Dependencies
├── README.md               # This file
└── server.js               # Entry point
```

## 🔐 Security Features

- **Password Hashing**: Bcrypt with 10 salt rounds
- **JWT Tokens**: 1-hour expiration
- **Helmet**: HTTP security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Joi schema validation
- **SQL/NoSQL Injection Prevention**: Mongoose data sanitization
- **File Upload Validation**: MIME type and size restrictions

## 📝 Validation Rules

### Email
- Must be a valid email format

### Phone Number
- Must be a 10-digit number starting with 6-9

### Pincode
- Must be a 6-digit number

### GST Number
- Format: IDDDDDDDDDDDDDDZ
- 2-digit state code + 5-letter PAN + 4-digit sequence + verification characters

### PAN Number
- Format: AAAABBBBBCCCCN
- 5-letter + 4-digit + letter + digit + letter

### Password
- Minimum 8 characters
- Must contain uppercase, lowercase, number, and special character

## 🚨 Error Handling

All errors follow this standard format:

```json
{
  "success": false,
  "message": "Validation error",
  "data": null,
  "error": "GST number is invalid"
}
```

### Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request / Validation Error
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict (Duplicate)
- `500`: Server Error

## 📋 Database Schema

### User Collection
- `_id`: ObjectId
- `email`: String (unique, indexed)
- `password`: String (hashed)
- `createdAt`: Date
- `updatedAt`: Date

### Business Collection
- `_id`: ObjectId
- `userId`: ObjectId (reference to User)
- `legalBusinessName`: String
- `proprietorName`: String
- `gstNumber`: String (unique, indexed)
- `businessPhone`: String
- `businessEmail`: String
- `addressLine1`: String
- `area`: String
- `city`: String
- `state`: String
- `pincode`: String
- `businessType`: Enum (Wholesaler, Manufacturer, Distributor, Retailer)
- `panNumber`: String
- `businessLicenceImage`: Object { imageURL, publicId }
- `warehouseName`: String
- `contactPerson`: String
- `fullAddress`: String
- `warehouseCity`: String
- `warehousePincode`: String
- `locationMapAddress`: String
- `distributorCode`: String (unique, indexed)
- `isCompleted`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

## 🔄 Distributor Code Generation

Format: `DIST` + 4 random digits

Example: `DIST4831`

- Generated when Step 4 is completed
- Guaranteed to be unique in the database
- Persisted in the Business collection

## 📦 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGO_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | JWT signing secret | your_secret_key |
| JWT_EXPIRE | JWT expiration time | 1h |
| CLOUDINARY_CLOUD_NAME | Cloudinary account name | xyz123 |
| CLOUDINARY_API_KEY | Cloudinary API key | 123456789 |
| CLOUDINARY_API_SECRET | Cloudinary API secret | xyz_secret |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add NewFeature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Support

For support, email support@distrihub.com or open an issue in the repository.

---

**Happy Coding! 🚀**
