
import { authenticate } from "../middlewares/authentication.js"
import { addTransaction, getTransaction, deleteTransaction, deleteMultiple, updateTransaction } from "../controllers/transactionController.js"

import express from "express"

const router = express.Router()
// create the transaction
router.route("/add").post(authenticate, addTransaction)

// get the transaction
router.route("/").get(authenticate, getTransaction)

//delete the transaction 
router.route("/delete/:Tid").delete(authenticate, deleteTransaction)

//deleting multiple transactions
router.route("/").delete(authenticate, deleteMultiple)

//updating the transaction
router.route("/update/:id").put(authenticate, updateTransaction);

export default router