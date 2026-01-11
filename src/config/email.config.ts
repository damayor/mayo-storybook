/**
 * Email Configuration
 * Update these values with your actual SMTP settings
 */

export const emailConfig = {
  // SMTP Server Settings
  smtp: {
    host: process.env.VITE_SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.VITE_SMTP_PORT || '587'),
    secure: process.env.VITE_SMTP_SECURE === 'true' || false, // true for 465, false for other ports
    auth: {
      user: process.env.VITE_SMTP_USER || '',
      pass: process.env.VITE_SMTP_PASS || '',
    },
  },

  // Recipient Email Addresses
  recipients: {
    primary: process.env.VITE_EMAIL_PRIMARY || 'xxx@gmail.com',
    secondary: process.env.VITE_EMAIL_SECONDARY || 'xxx@mayinteractive.io',
  },

  // Sender Configuration
  sender: {
    name: process.env.VITE_EMAIL_SENDER_NAME || 'May Interactive Contact Form',
    email: process.env.VITE_EMAIL_SENDER || 'noreply@mayinteractive.io',
  },
};
