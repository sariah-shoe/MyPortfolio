import express from "express";
import rateLimit from "express-rate-limit";
import * as controller from "./auth.controller.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, controller.login);
router.post("/logout", controller.logout);
router.get("/me", controller.me);

export {router};
