import jwt from "jsonwebtoken";

export const jwtSign = (tokenData) => {
    return jwt.sign(tokenData, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

export const verifyJwt = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}