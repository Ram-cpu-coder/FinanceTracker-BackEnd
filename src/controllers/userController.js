import { createUser, getUser, getUserByEmail } from "../Model/user/UserModel.js"
import { jwtSign } from "../utils/jwt.js"

import { hashPw, comparePw } from "../utils/bcrypt.js";

export const register = async (req, res, next) => {
    try {

        const { username, email } = req.body

        let { password } = req.body
        password = await hashPw(password)

        const data = await createUser(
            {
                username,
                email,
                password
            }
        )
        data ?
            next({
                statusCode: 201,
                message: "User Created",
                data
            }) : next({
                statusCode: 404,
                message: "Couldnot Register"
            })
    }
    catch (error) {
        console.log(error)
        if (error?.message?.includes("E11000")) {
            next({
                statusCode: 400,
                message: "DUPLICATE USER"
            })

        } else {
            next({
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
            const loginSuccess = await comparePw(password, userData.password)
            const tokenData = {
                email: userData.email,
            }
            const token = await jwtSign(tokenData)
            if (loginSuccess) {
                res.status(200).json({
                    status: "success",
                    message: "Login Successful",
                    accessToken: token,
                    user: {
                        _id: userData._id
                    }
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
        console.log(error)
        res.status(500).json({
            status: "error",
            message: "Log in error"
        })
    }


}



export const user = async (req, res) => {
    req.userData.password = "";

    return res.send({
        status: "success",
        message: "users found",
        user: req.userData
    })
}