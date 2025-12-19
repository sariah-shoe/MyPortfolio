import { verifyToken } from "../auth/jwt.js";
import { COOKIE_NAME } from "../auth/cookie.js";

function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Auth required" });
  try {
    const claims = verifyToken(token); // { sub, role, ... }
    req.user = claims;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid/expired session" });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  next();
}

export {requireAuth, requireAdmin}