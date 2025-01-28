
import bcrypt from "bcrypt";

export const hashPw = (password) => {
    const saltRound = 10;
    return bcrypt.hash(password, saltRound)
}

export const comparePw = (plainttext, encryptedtext) => {
    return bcrypt.compare(plainttext, encryptedtext)
}