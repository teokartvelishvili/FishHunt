import { CookieOptions } from 'express';

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const commonOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  path: '/',
  domain: undefined,
  maxAge: undefined // Using expires instead for better Safari support
};

export const cookieConfig = {
  access: {
    name: 'access_token',
    options: {
      ...commonOptions,
      expires: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes
    }
  },
  refresh: {
    name: 'refresh_token',
    options: {
      ...commonOptions,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    }
  }
};
