# Zoho Desk API Token Setup Guide

## 🔐 Your Client Credentials

- **Client ID:** `1000.INCDKRWKFELMVX9JHAGSVBX1ENINTG`
- **Client Secret:** `b9fc446c6ba98d25b9f3c8afcbea06c604a8265f3d`
- **Organization ID:** `2389290` (from your curl example)

## 🚀 Quick Setup Steps

### Step 1: Get Authorization Code

Visit this URL in your browser:

```
https://accounts.zoho.com/oauth/v2/auth?scope=Desk.tickets.CREATE%2CDesk.tickets.READ%2CDesk.contacts.CREATE%2CDesk.contacts.READ&client_id=1000.INCDKRWKFELMVX9JHAGSVBX1ENINTG&response_type=code&redirect_uri=https://www.google.com&access_type=offline
```

### Step 2: Grant Permissions

- Log in to your Zoho account
- Grant the required permissions:
  - Desk.tickets.CREATE
  - Desk.tickets.READ
  - Desk.contacts.CREATE
  - Desk.contacts.READ

### Step 3: Copy Authorization Code

After granting permissions, you'll be redirected to:

```
https://www.google.com/?code=1000.abc123def456...
```

Copy the `code` parameter value.

### Step 4: Exchange Code for Access Token

Run this curl command (replace `YOUR_CODE` with the actual code):

```bash
curl -X POST "https://accounts.zoho.com/oauth/v2/token" \
  -d "client_id=1000.INCDKRWKFELMVX9JHAGSVBX1ENINTG" \
  -d "client_secret=b9fc446c6ba98d25b9f3c8afcbea06c604a8265f3d" \
  -d "grant_type=authorization_code" \
  -d "code=YOUR_CODE" \
  -d "redirect_uri=https://www.google.com"
```

### Step 5: Update Environment Variables

You'll get a response like:

```json
{
  "access_token": "1000.abc123...",
  "refresh_token": "1000.def456...",
  "api_domain": "https://www.zohoapis.com",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

Update your `.env.local` file:

```env
ZOHO_ORG_ID=2389290
ZOHO_ACCESS_TOKEN=1000.abc123...
ZOHO_REFRESH_TOKEN=1000.def456...
ZOHO_API_URL=https://desk.zoho.com/api/v1
```

### Step 6: Test Your Setup

Test with curl:

```bash
curl -X GET https://desk.zoho.com/api/v1/tickets \
  -H "orgId:2389290" \
  -H "Authorization:oauthtoken YOUR_ACCESS_TOKEN"
```

## 🔄 Token Refresh

Access tokens expire in 1 hour. Use the refresh token to get new access tokens:

```bash
curl -X POST "https://accounts.zoho.com/oauth/v2/token" \
  -d "client_id=1000.INCDKRWKFELMVX9JHAGSVBX1ENINTG" \
  -d "client_secret=b9fc446c6ba98d25b9f3c8afcbea06c604a8265f3d" \
  -d "grant_type=refresh_token" \
  -d "refresh_token=YOUR_REFRESH_TOKEN"
```

## ✅ Once Setup Complete

After setting up your tokens, the demo will:

- ✅ Create real tickets in your Zoho Desk
- ✅ Search/create contacts automatically
- ✅ Show success/error messages
- ✅ Work without any redirects

## 🔍 Troubleshooting

- Ensure your Zoho account has Desk enabled
- Check that organization ID `2389290` is correct
- Verify token has not expired (1 hour limit)
- Check console logs for detailed error messages
