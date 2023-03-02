import { createCookie } from 'solid-start';

export const frameworkCookie = createCookie('framework', {
  secure: import.meta.env.PROD,
  sameSite: 'strict',
  maxAge: 2592e3, // 30 days
  httpOnly: import.meta.env.PROD,
  path: '/',
});
