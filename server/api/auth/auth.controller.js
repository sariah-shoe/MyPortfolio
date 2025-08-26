// server/api/auth/auth.controller.js
import bcrypt from "bcrypt";
import { signUser, verifyToken } from "../../auth/jwt.js";
import { cookieOptions, COOKIE_NAME } from "../../auth/cookie.js";
import { User } from "../users/user.model.js";

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Sets an HTTP-only session cookie if credentials are valid.
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    // Use the same error for both cases to avoid user enumeration
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    // Create short-lived JWT and set as secure, httpOnly cookie
    const token = signUser({ sub: user.id, role: user.role }, "2h");
    res.cookie(COOKIE_NAME, token, cookieOptions);

    return res.status(200).json({ ok: true, role: user.role });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/auth/logout
 * Clears the session cookie.
 */
export async function logout(_req, res, _next) {
  // Use same attrs as cookieOptions for compatibility when clearing
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: 0 });
  return res.status(200).json({ ok: true });
}

/**
 * GET /api/auth/me
 * Returns { authenticated: boolean, userId?, role? } based on cookie.
 */
export async function me(req, res, _next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.json({ authenticated: false });

  try {
    const { sub, role } = verifyToken(token);
    return res.json({ authenticated: true, userId: sub, role });
  } catch {
    return res.json({ authenticated: false });
  }
}
