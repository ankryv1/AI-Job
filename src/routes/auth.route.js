import express from 'express';
import { userLoginController, userLogoutController, userSignupController } from '../controllers/auth.controller.js';
import { authMiddlewear } from '../middlewear/auth.middlewear.js';

const router = express.Router();

router.post("/signup", userSignupController);
router.post("/login", userLoginController);
router.get("/logout", authMiddlewear, userLogoutController)

export default router;