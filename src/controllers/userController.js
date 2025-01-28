import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { createUser, getAllUser, getUserByEmail } from "../Model/user/UserModel.js"

export const register = async (req, res) => {
    try {

        const { username, email } = req.body

        let { password } = req.body
        const saltRound = 10
        password = await bcrypt.hash(password, saltRound)

        const data = await createUser(
            {
                username,
                email,
                password
            }
        )

        res.send({
            status: "success",
            message: "User Created",
            data,
        })
    }
    catch (error) {
        console.log(error.message)
        if (error?.message?.includes("E11000")) {
            res.status(400).json({
                status: "error",
                message: "Duplicate User"
            })
        } else {
            res.status(500).json({
                status: "error",
                message: "Error creating user"
            })
        }
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const userData = await getUserByEmail(email);

        if (userData) {
            const loginSuccess = await bcrypt.compare(password, userData.password)
            const tokenData = {
                email: userData.email,
            }
            const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            })
            if (loginSuccess) {
                res.status(200).json({
                    status: "success",
                    message: "Login Successful",
                    accessToken: token,
                })
            }
            else {
                res.status(403).json({
                    status: "error",
                    message: "Password Wrong"
                })
            }
        } else {
            res.status(404).json({
                status: "error",
                message: "User not found"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Log in error"
        })
    }


}

export const users = async (req, res) => {
    const users = await getAllUser()
    res.send({
        status: "success",
        message: "users found",
        users
    })
}