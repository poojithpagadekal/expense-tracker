import express from "express";
import {
  loginHandler,
  logoutHandler,
  refreshHandler,
  RegisterHandler,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", RegisterHandler);
router.post("/login", loginHandler);
router.post("/logout", logoutHandler);
router.post("/refresh", refreshHandler);

export default router;
