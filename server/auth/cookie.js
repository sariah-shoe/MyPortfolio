const isProd = process.env.NODE_ENV === "production";

export const cookieOptions = {
  httpOnly: true,
  secure: isProd,     // true in prod (HTTPS)
  sameSite: "lax",
  path: "/",
  maxAge: 2 * 60 * 60 * 1000, // 2 hours
};

export const COOKIE_NAME = process.env.COOKIE_NAME || "portfolio_sess";
