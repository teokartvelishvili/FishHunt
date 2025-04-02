export const cookieConfig = {
  access: {
    options: {
      httpOnly: true,
      secure: true,
      sameSite: 'none' as const,
      path: '/',
      maxAge: 20 * 60 * 1000,
      expires: new Date(Date.now() + 20 * 60 * 1000),
      domain: process.env.NODE_ENV === 'production' 
        ? process.env.COOKIE_DOMAIN 
        : undefined,
    },
  },
  refresh: {
    options: {
      httpOnly: true,
      secure: true, // Always true for iOS
      sameSite: 'none' as const,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: process.env.NODE_ENV === 'production' 
        ? process.env.COOKIE_DOMAIN 
        : undefined, // Add your domain in production
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // explicit expires for iOS
    },
  },
};
