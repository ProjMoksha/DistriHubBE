# DistriHub Business Registration API - Updated Documentation

## Overview
The Business Registration API has been completely restructured with new endpoints, improved naming conventions, and enhanced functionality. The 3-step registration process is now more intuitive with businessId-based operations and automatic distributor code generation.

## API Endpoints Summary

### 1. Business Types (Public)
**GET** `/api/business/types`
- **Description**: Retrieve all available business types
- **Authentication**: Not required
- **Response**:
```json
{
  "success": true,
  "message": "Business types retrieved successfully",
  "data": {
    "businessTypes": ["Wholesaler", "Manufacturer", "Distributor", "Retailer"]
  }
}
```

---

### 2. Create Business (Step 1)
**POST** `/api/business/CreateBusiness`
- **Description**: Initialize a new business registration
- **Authentication**: Required (Bearer Token)
- **Request Body**:
```json
{
  "legalBusinessName": "ABC Distribution Pvt Ltd",
  "proprietorName": "John Doe",
  "businessPhone": "9876543210",
  "businessEmail": "john@example.com",
  "addressLine1": "123 Business Street",
  "area": "Downtown",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Business created successfully. Proceeding to verification step..",
  "data": {
    "businessId": "60c72b2f9c1a4f0015a8e9c1",
    "business": { /* full business object */ }
  }
}
```
- **Notes**: 
  - Returns businessId which is required for subsequent steps
  - Access token should be included after user registration/login

---

### 3. Get Business by ID (Step 1)
**GET** `/api/business/CreateBusiness/{id}`
- **Description**: Retrieve business basic details
- **Authentication**: Required
- **Response**: Returns business object

---

### 4. Update Business (Step 1)
**PUT** `/api/business/CreateBusiness/{id}`
- **Description**: Update business basic details
- **Authentication**: Required
- **Request Body**: Same as CreateBusiness (all fields optional)

---

### 5. Delete Business (Step 1)
**DELETE** `/api/business/CreateBusiness/{id}`
- **Description**: Delete business record
- **Authentication**: Required

---

### 6. Verify Business (Step 2)
**POST** `/api/business/VerifyBusiness`
- **Description**: Complete business verification with GST, PAN, and optional licence upload
- **Authentication**: Required
- **Content-Type**: `multipart/form-data` (if file upload)
- **Request Body**:
```json
{
  "businessId": "60c72b2f9c1a4f0015a8e9c1",
  "businessType": "Distributor",
  "gstNumber": "27AABCU1234H1Z0",
  "panNumber": "ABCDE1234F",
  "businessLicenceImage": <file - optional>
}
```
- **Valid Business Types**: 
  - Wholesaler
  - Manufacturer
  - Distributor
  - Retailer
- **Response**:
```json
{
  "success": true,
  "message": "Business verified successfully. Proceeding to warehouse setup..",
  "data": {
    "businessId": "60c72b2f9c1a4f0015a8e9c1",
    "business": { /* full business object with verification details */ }
  }
}
```
- **Field Validations**:
  - GST: Format `[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}`
  - PAN: Format `[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}`

---

### 7. Get Business Verification Details (Step 2)
**GET** `/api/business/VerifyBusiness/{id}`
- **Description**: Retrieve verification details
- **Authentication**: Required

---

### 8. Update Business Verification (Step 2)
**PUT** `/api/business/VerifyBusiness`
- **Description**: Update verification details
- **Authentication**: Required
- **Request Body**: Same as VerifyBusiness (all fields optional)

---

### 9. Delete Business Verification (Step 2)
**DELETE** `/api/business/VerifyBusiness`
- **Description**: Delete verification details only
- **Authentication**: Required
- **Request Body**:
```json
{
  "businessId": "60c72b2f9c1a4f0015a8e9c1"
}
```

---

### 10. Create Warehouse & Complete Registration (Step 3)
**POST** `/api/business/CreateWareHouse`
- **Description**: Create warehouse details and generate 8-digit distributor code
- **Authentication**: Required
- **Request Body**:
```json
{
  "businessId": "60c72b2f9c1a4f0015a8e9c1",
  "warehouseName": "Main Warehouse",
  "contactPerson": "Jane Smith",
  "fullAddress": "123 Warehouse Lane, Industrial Area",
  "warehouseCity": "Mumbai",
  "warehousePincode": "400020",
  "warehouseState": "Maharashtra",
  "locationLink": "https://maps.google.com/..."
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Registration completed! Your distributor code has been generated.",
  "data": {
    "businessId": "60c72b2f9c1a4f0015a8e9c1",
    "distributorCode": "DIST5678",
    "business": { /* full business object with distributor code */ }
  }
}
```
- **Notes**:
  - Distributor code format: `DIST` + 4 random digits (e.g., `DIST1234`)
  - Automatically sets `isCompleted` to `true`
  - Generates unique code checked against database

---

### 11. Get Warehouse Details (Step 3)
**GET** `/api/business/CreateWareHouse/{businessId}`
- **Description**: Retrieve warehouse details including distributor code
- **Authentication**: Required

---

### 12. Update Warehouse Details (Step 3)
**PUT** `/api/business/CreateWareHouse`
- **Description**: Update warehouse details
- **Authentication**: Required
- **Request Body**: Same as CreateWareHouse (all fields optional)

---

### 13. Delete Warehouse (Step 3)
**DELETE** `/api/business/CreateWareHouse`
- **Description**: Delete warehouse and reset registration
- **Authentication**: Required
- **Request Body**:
```json
{
  "businessId": "60c72b2f9c1a4f0015a8e9c1"
}
```
- **Notes**: 
  - Clears distributor code
  - Sets `isCompleted` back to `false`

---

## Registration Flow

### Step 1: User Registration
```
POST /api/auth/register
→ Response includes: access token
```

### Step 2: Get Business Types
```
GET /api/business/types
→ Response includes: list of business types
```

### Step 3: Create Business
```
POST /api/business/CreateBusiness
Headers: { Authorization: "Bearer <token>" }
→ Response includes: businessId
```

### Step 4: Verify Business
```
POST /api/business/VerifyBusiness
Headers: { Authorization: "Bearer <token>" }
Body: { businessId, businessType, gstNumber, panNumber, businessLicenceImage? }
→ Response includes: updated business object
```

### Step 5: Create Warehouse
```
POST /api/business/CreateWareHouse
Headers: { Authorization: "Bearer <token>" }
Body: { businessId, warehouseName, contactPerson, fullAddress, warehouseCity, warehousePincode, warehouseState, locationLink? }
→ Response includes: distributorCode
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "data": null,
  "error": "business type must be one of: Wholesaler, Manufacturer, Distributor, Retailer"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null,
  "error": "Invalid or missing token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Business not found",
  "data": null,
  "error": "Business record does not exist"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Business already exists",
  "data": null,
  "error": "A business with this GST number already exists"
}
```

---

## Backward Compatibility

The following legacy endpoints are still supported:
- `POST /api/business/step1` → Use `POST /api/business/CreateBusiness`
- `POST /api/business/step2` → Use `POST /api/business/VerifyBusiness`
- `POST /api/business/step3` → Use `POST /api/business/CreateWareHouse`
- `POST /api/business/step4` → Use `POST /api/business/CreateWareHouse`

All legacy endpoints function identically to their new counterparts.

---

## Field Validations

### Business Phone
- Must be 10 digits
- Must start with 6-9
- Pattern: `[6-9]\d{9}`

### Pincode
- Must be exactly 6 digits
- Pattern: `^\d{6}$`

### GST Number
- Format: `[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}`
- Example: `27AABCU1234H1Z0`

### PAN Number
- Format: `[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}`
- Example: `ABCDE1234F`

---

## Database Schema

### Business Collection
```javascript
{
  userId: ObjectId,           // Reference to User
  
  // Step 1: CreateBusiness
  legalBusinessName: String,
  proprietorName: String,
  businessPhone: String,
  businessEmail: String,
  addressLine1: String,
  area: String,
  city: String,
  state: String,
  pincode: String,
  
  // Step 2: VerifyBusiness
  businessType: String,       // Enum: Wholesaler, Manufacturer, Distributor, Retailer
  gstNumber: String,          // Unique
  panNumber: String,
  businessLicenceImage: {
    imageURL: String,
    publicId: String
  },
  
  // Step 3: CreateWareHouse
  warehouseName: String,
  contactPerson: String,
  fullAddress: String,
  warehouseCity: String,
  warehousePincode: String,
  warehouseState: String,
  locationLink: String,
  
  // Step 3: Generated
  distributorCode: String,    // Unique, Format: DISTxxxx
  isCompleted: Boolean,        // true after Step 3
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## Testing

Unit tests are available at:
- `tests/unit/services/businessService.new.test.js`

Integration tests are available at:
- `tests/integration/business.api.test.js`

Run tests with:
```bash
npm test
npm run test:watch
npm run test:coverage
```

---

## Key Changes Summary

### ✅ Improvements Made
1. **Renamed endpoints** to be more descriptive (CreateBusiness, VerifyBusiness, CreateWareHouse)
2. **BusinessId-based operations** instead of userId where appropriate
3. **Automatic distributor code generation** in final step with format: `DIST` + 4 random digits
4. **Public business types endpoint** for frontend to display available options
5. **Enhanced validation** with detailed error messages
6. **Comprehensive Swagger documentation** for all endpoints
7. **Full test coverage** with unit and integration tests
8. **Backward compatibility** maintained for legacy endpoints
9. **Improved field organization** with optional fields (businessLicenceImage, locationLink)
10. **Better response messages** indicating next steps in registration flow

### 📝 API Structure
- **Step 1**: Create basic business details → Returns `businessId`
- **Step 2**: Verify business with GST, PAN, and optional licence
- **Step 3**: Create warehouse and generate `distributorCode`

### 🔐 Authentication
All endpoints (except `/types`) require Bearer token from user registration/login

### 📋 Validation
- All required fields are validated before database operations
- Format validation for GST, PAN, phone, pincode, email
- Business type must be selected from predefined list

---

## Migration Guide (for Front-end)

### Old Flow → New Flow

**Before:**
```
POST /api/business/step1          → Get userId from token
POST /api/business/step2          → Use userId
POST /api/business/step3          → Use userId
POST /api/business/step4          → Get distributorCode
```

**After:**
```
GET /api/business/types           → Get available business types
POST /api/business/CreateBusiness → Get businessId response
POST /api/business/VerifyBusiness → Pass businessId in request
POST /api/business/CreateWareHouse → Pass businessId in request → Get distributorCode
```

**Key Differences:**
1. Business types must be fetched from API (not hardcoded)
2. Save `businessId` from first step to use in subsequent steps
3. Pass `businessId` in request body for steps 2-3 (not in URL params)
4. Distributor code is returned after warehouse creation
5. businessLicenceImage is now optional in step 2

---

## Known Limitations

- File uploads are limited to image formats (jpg, jpeg, png, gif)
- File size limit: 5MB
- Distributor code generation max attempts: 100
- GST/PAN must be unique across system

---

## Future Enhancements

- [ ] Batch distributor code generation
- [ ] Business registration status tracking
- [ ] Email notifications on registration completion
- [ ] Document verification workflow
- [ ] API rate limiting per user
- [ ] Webhook support for registration events

