export interface CookieOptions {
  httpOnly: true;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  maxAge: number;
  path: string;
  domain?: string;
}

export interface CookieConfig {
  name: string;
  options: CookieOptions;
}

export const cookieConfig: Record<string, CookieConfig> = {
  access: {
    name: 'access_token',
    options: {
      httpOnly: true,
      secure: true, // Always set to true for cross-origin
      sameSite: 'none', // Required for cross-origin
      path: '/',
      maxAge: 10 * 60 * 1000, // 10 minutes
    },
  },
  refresh: {
    name: 'refresh_token',
    options: {
      httpOnly: true,
      secure: true, // Always set to true for cross-origin
      sameSite: 'none', // Required for cross-origin
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  },
} as const;
