import express from "express"
import cors from "cors"

import { connectMongoDB } from "./src/config/mongodbConfig.js"
import userRouter from "./src/routers/userRoutes.js";
import transactionRouter from "./src/routers/transactionRoutes.js"
import { errorHandler } from "./src/middlewares/errorHandler.js";


//connection to the mongo database
connectMongoDB()

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json())
app.use(cors())

// user routing
app.use("/api/v1/users", userRouter)

// transaction routing 
app.use("/api/v1/transactions", transactionRouter)

app.use(errorHandler)

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log('Server started')
})