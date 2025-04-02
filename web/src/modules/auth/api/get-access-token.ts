'use client';

// მარტივი ფუნქცია document.cookie-დან ტოკენის წასაკითხად
export const getAccessToken = () => {
  const cookies = document.cookie.split(';');
  const accessTokenCookie = cookies.find(cookie => cookie.trim().startsWith('access_token='));
  return accessTokenCookie ? decodeURIComponent(accessTokenCookie.split('=')[1]) : null;
};
