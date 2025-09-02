# SendGrid Email Setup Guide

## Overview
This guide explains how to set up SendGrid email functionality for the Odontoa website contact and demo forms.

## Prerequisites
- SendGrid account (created at [sendgrid.com](https://sendgrid.com))
- Domain verification completed in SendGrid

## Step 1: Get SendGrid API Key
1. Log in to your SendGrid account
2. Go to Settings → API Keys
3. Create a new API key with "Mail Send" permissions
4. Copy the API key (you won't be able to see it again)

## Step 2: Verify Your Domain
1. In SendGrid, go to Settings → Sender Authentication
2. Click "Authenticate Your Domain"
3. Follow the DNS setup instructions for your domain
4. Wait for DNS propagation (can take up to 48 hours)

## Step 3: Environment Variables
Create a `.env.local` file in your project root with:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=your_actual_api_key_here
SENDGRID_FROM_EMAIL=info@odontoa.com
```

## Step 4: Test the Setup
1. Start your development server: `npm run dev`
2. Fill out a contact form or demo form
3. Check your email (info@odontoa.com and ognjen.drinic31@gmail.com)
4. Check the browser console for any errors

## Email Templates
The system sends emails to both:
- `info@odontoa.com` (your business email)
- `ognjen.drinic31@gmail.com` (your personal email)

## Form Types
1. **Contact Form** - Full contact form with all fields
2. **Demo Form** - Simple demo request form

## Troubleshooting
- **API Key Error**: Ensure your API key is correct and has proper permissions
- **Domain Not Verified**: Complete domain authentication in SendGrid
- **Email Not Sending**: Check browser console and server logs
- **Spam Folder**: Check spam/junk folders for test emails

## Security Notes
- Never commit your `.env.local` file to version control
- The API key has limited permissions (Mail Send only)
- All form data is validated before processing
- Emails are sent from your verified domain

## Support
If you encounter issues:
1. Check SendGrid dashboard for delivery status
2. Verify domain authentication is complete
3. Test with a simple email first
4. Check server logs for detailed error messages
