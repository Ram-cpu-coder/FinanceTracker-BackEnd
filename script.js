import express from "express"
import cors from "cors"
import mongoose from "mongoose";
import { connectMongoDB } from "./config/mongodbConfig.js";
import bcrypt from "bcrypt"

//connection to the mongo database
connectMongoDB()

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json())
app.use(cors())

// mongoose schema

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
)
//mongoose model
const User = mongoose.model("user", userSchema)



app.get("/", (req, res) => {
    res.json({
        message: "It's live"
    })
})

app.post("/api/v1/users/register", async (req, res) => {
    try {

        const { username, email } = req.body
        // or
        // const newUser = new User(req.body);

        let { password } = req.body
        const saltRound = 10
        password = await bcrypt.hash(password, saltRound)

        const newUser = new User({
            username,
            email,
            password
        })
        const data = await newUser.save();


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
})
app.post("/api/v1/users/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const userData = await User.findOne({ email });
        if (userData) {
            const loginSuccess = await bcrypt.compare(password, userData.password)
            if (loginSuccess) {
                res.status(200).json({
                    status: "success",
                    message: "Login Successful",
                    userData
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


})



app.listen(PORT, (error) => {
    error ? console.log(error) : console.log('Server started')
})