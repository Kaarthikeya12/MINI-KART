# Google OAuth Setup Guide

## Overview
This guide will help you set up Google OAuth authentication for your Mini Kart e-commerce application.

## Prerequisites
- A Google account
- Access to Google Cloud Console

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter project name: "Mini Kart" (or your preferred name)
5. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in the required fields:
     - App name: Mini Kart
     - User support email: your email
     - Developer contact: your email
   - Click "Save and Continue"
   - Skip scopes (click "Save and Continue")
   - Add test users if needed
   - Click "Save and Continue"

4. Create OAuth Client ID:
   - Application type: "Web application"
   - Name: "Mini Kart Web Client"
   - Authorized JavaScript origins:
     - http://localhost:3000
     - http://localhost:3001
   - Authorized redirect URIs:
     - http://localhost:3000/api/auth/callback/google
     - http://localhost:3001/api/auth/callback/google
   - Click "Create"

5. Copy your Client ID and Client Secret

## Step 4: Update Environment Variables

Add the following to your `.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
```

To generate a NEXTAUTH_SECRET, run:
```bash
openssl rand -base64 32
```

## Step 5: Install NextAuth.js

Run the following command to install NextAuth.js:

```bash
pnpm add next-auth @auth/core
```

## Step 6: Restart Your Development Server

After adding the environment variables and installing packages:

```bash
# Stop the current dev server (Ctrl+C)
pnpm dev
```

## Step 7: Test Google Login

1. Navigate to http://localhost:3000/login
2. Click the "Continue with Google" button
3. Select your Google account
4. Grant permissions
5. You should be redirected to the dashboard

## Production Setup

For production deployment:

1. Update authorized origins and redirect URIs in Google Cloud Console
2. Add your production domain (e.g., https://yourdomain.com)
3. Update environment variables on your hosting platform
4. Ensure NEXTAUTH_URL points to your production URL

## Troubleshooting

### "Redirect URI mismatch" error
- Ensure the redirect URI in Google Console exactly matches your callback URL
- Check for trailing slashes
- Verify the protocol (http vs https)

### "Access blocked" error
- Make sure you've added yourself as a test user in the OAuth consent screen
- Check that the OAuth consent screen is properly configured

### User not being created
- Check Payload CMS logs for errors
- Verify database connection
- Ensure Users collection is properly configured

## Security Notes

- Never commit your `.env` file to version control
- Keep your Client Secret secure
- Regularly rotate your NEXTAUTH_SECRET
- Use HTTPS in production
- Implement rate limiting for authentication endpoints

## Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Payload CMS Authentication](https://payloadcms.com/docs/authentication/overview)
