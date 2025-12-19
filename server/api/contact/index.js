import * as controller from "./contact.controller.js"
import express from "express";
import rateLimit from 'express-rate-limit'

export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});

const router = express.Router();

router.post("/", contactLimiter, controller.sendEmail);

export {router}