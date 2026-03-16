import express from 'express';
import { getMeController, userLoginController, userLogoutController, userSignupController } from '../controllers/auth.controller.js';
import { authMiddlewear } from '../middlewear/auth.middlewear.js';

const router = express.Router();

router.post("/register", userSignupController);
router.post("/login", userLoginController);
router.get("/logout", authMiddlewear, userLogoutController)
router.get("/get-me", authMiddlewear, getMeController)

export default router;