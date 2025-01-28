import userModel from "./UserSchema.js";

//create user
export const createUser = (userObj) => {
    return userModel(userObj).save();
}

//read user
export const getUserByEmail = (email) => {
    return userModel.findOne({ email })
}

export const getAllUser = () => {
    return userModel.find()
}