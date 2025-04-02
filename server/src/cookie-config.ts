export const cookieConfig = {
  access: {
    options: {
      httpOnly: true,
      secure: true,
      sameSite: 'none' as const,
      path: '/',
      maxAge: 20 * 60 * 1000,
      expires: new Date(Date.now() + 20 * 60 * 1000),
      domain: '.fishhunt1.onrender.com', // ფიქსირებული მნიშვნელობა
    },
  },
  refresh: {
    options: {
      httpOnly: true,
      secure: true,
      sameSite: 'none' as const,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      domain: '.fishhunt1.onrender.com', // ფიქსირებული მნიშვნელობა
    },
  },
};
