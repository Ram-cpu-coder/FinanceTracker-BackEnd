import express from "express"
import cors from "cors"
import mongoose from "mongoose";
import { connectMongoDB } from "./config/mongodbConfig.js";
import bcrypt from "bcrypt"
import jwt, { decode } from "jsonwebtoken"

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

// transaction schema 
const transactionSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["Income", "Expense"],
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        default: ""
    }

},
    { timestamps: true })

// model for transaction
const Transaction = mongoose.model("Transaction", transactionSchema)

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


})
// create the transaction
app.post("/api/v1/transactions/add", async (req, res) => {
    try {
        //1. get the token
        const token = req.headers.authorization;

        // 2. verify the token 
        const decodedData = await jwt.verify(token, process.env.JWT_SECRET);

        if (decodedData?.email) {

            // 3. find the user from the decoded data
            const userData = await User.findOne({ email: decodedData.email })

            if (userData) {
                // 4. create the transaction
                const { type, description, amount, date } = req.body
                const newTransaction = new Transaction({
                    userID: userData._id,
                    type,
                    description,
                    amount,
                    date
                })
                const newData = await newTransaction.save();
                res.status(201).json({
                    status: "success",
                    message: "Transaction Created",
                    Transaction: newData
                })
            } else {
                res.status(404).json({
                    status: "error",
                    message: "User Not found",
                })
            }

        } else {
            res.status(401).json({
                status: "error",
                message: "No payload",
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
})
// get the transaction
app.get("/api/v1/transactions", async (req, res) => {
    try {
        // 1. get the token
        const token = req.headers.authorization

        // 2. verify the token 
        const decodedData = await jwt.verify(token, process.env.JWT_SECRET)

        if (decodedData?.email) {
            // 3. find the user from the decoded data 
            const userData = await User.findOne({ email: decodedData.email })
            if (userData) {
                // 4. fetch the transaction data of the user with the user id from the userData
                const transactionData = await Transaction.find({
                    userID: userData._id
                })
                res.status(201).json({
                    status: "success",
                    message: "Transaction found",
                    transactionData
                })
            }
            else {
                res.status(401).json({
                    status: "error",
                    message: "Transaction Not found",
                })
            }

        } else {
            res.status(401).json({
                status: "error",
                message: "No payload",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "error",
            message: "Error fetching the transaction",
        })
    }
})
//delete the transaction 
app.delete("/api/v1/transactions/delete/:id"), async (req, res) => {
    try {
        const id = req.params.id
        // 1. get the token 
        const token = req.headers.authorization
        console.log(token, 300)
        // 2. verify the token 
        const decodedData = await jwt.verify(token, process.env.JWT_SECRET)

        // 3. find the userData
        const userData = User.findOne({ email: decodedData.email })
        console.log(userData)
        if (decodedData) {
            if (userData) {
                // 4. find the transaction 
                const transactionData = Transaction.findById(id)
                console.log(transactionData)

                res.status(201).json({
                    status: "success",
                    message: "Transaction Deleted",
                    filteredData
                })
            }
            else {
                res.status(401).json({
                    status: "error",
                    message: "Not Authorised",
                })
            }
        } else {
            res.status(401).json({
                status: "error",
                message: "Could not decode",
            })
        }
        res.status(200).json({
            message: "error"
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal Error"
        })
    }
}
app.listen(PORT, (error) => {
    error ? console.log(error) : console.log('Server started')
})