import express from "express";
import { register, login, users } from "../controllers/userController.js";


const router = express.Router()

router.route("/register").post(register)
router.route("/").get(users)
router.route("/login").post(login)


export default router