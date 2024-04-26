export const AUTH_TELEGRAM_ID = process.env.NEXT_PUBLIC_AUTH_TELEGRAM_ID || "";
export const MOCHI_PROFILE_API = `${
  process.env.NEXT_PUBLIC_MOCHI_PROFILE_API_HOST || "mochi-profile-api"
}/api/v1`;
export const MOCHI_PAY_API = `${
  process.env.NEXT_PUBLIC_MOCHI_PAY_API_HOST || "mochi-pay-api"
}/api/v1`;
export const MOCHI_API = `${
  process.env.NEXT_PUBLIC_MOCHI_API_HOST || "mochi-api"
}/api/v1`;
export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || "";
export const OPERATOR_WALLET_KEY = process.env.OPERATOR_WALLET_KEY || "";
export const BASE_PROVIDER_RPC = process.env.BASE_PROVIDER_RPC || "https://sepolia.base.org";
