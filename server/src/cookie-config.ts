import { CookieOptions } from 'express';

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Common options for all cookies
const commonOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction || isDevelopment, // Enable secure in both prod and dev
  sameSite: 'none', // Required for cross-origin requests
  path: '/',
  domain: undefined // Let the browser figure out the domain
};

export const cookieConfig = {
  access: {
    name: 'access_token',
    options: {
      ...commonOptions,
      maxAge: 20 * 60 * 1000, // 20 minutes
    }
  },
  refresh: {
    name: 'refresh_token', 
    options: {
      ...commonOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }
  }
};
