import jwt from "jsonwebtoken"
import { getUserByEmail } from "../Model/user/UserModel.js"

export const authenticate = async (req, res, next) => {
    // 1. get the token
    const token = req.headers.authorization

    // 2. verify the token
    const decodedData = await jwt.verify(token, process.env.JWT_SECRET)
    if (decodedData?.email) {
        // 3. find the user from the decoded data 
        const userData = await getUserByEmail(decodedData.email)
        console.log(userData)
        if (userData) {
            // 4. fetch the transactions of the user with the user id from the userData
            req.userData = userData
            next()
        }
        else {
            res.status(401).json({
                status: "error",
                message: "Transaction Not found",
            })
        }
    } else {
        return res.status(401).json({
            status: "error",
            message: "No payload",
        })
    }

    // if(){

    //     next()
    // }else{
    //    { const errorObj = {
    //         status : "error",
    //         message: "Authentication Failed!"
    //     }
    // return req.status
    // }
    // }
}