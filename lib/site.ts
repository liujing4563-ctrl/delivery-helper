export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  'https://delivery-helper.vercel.app'
).replace(/\/$/, '');
