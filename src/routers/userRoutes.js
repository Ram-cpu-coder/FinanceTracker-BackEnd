import express from "express";
import { register, login, user } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authentication.js";


const router = express.Router()

router.route("/register").post(register)
// router.route("/").get(users)
router.route("/").get(authenticate, user)
router.route("/login").post(login)


export default router