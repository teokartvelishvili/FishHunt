export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path?: string;
  domain?: string;
  maxAge: number;
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
      secure: true,
      sameSite: 'none',
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined,
      maxAge: 10 * 60 * 1000,
    },
  },
  refresh: {
    name: 'refresh_token',
    options: {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  },
} as const;
