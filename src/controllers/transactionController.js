
import { findOneTransaction, findTransaction, findOneAndDeleteTransaction, delManyTransaction, createTransaction, updateFinance } from "../Model/transaction/TransactionModel.js";

export const addTransaction = async (req, res) => {
    try {
        const { type, description, amount, date } = req.body
        const newData = await createTransaction({
            userID: req.userData._id,
            type,
            description,
            amount,
            date
        })
        res.status(201).json({
            status: "success",
            message: "Transaction Created",
            Transaction: newData
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

export const getTransaction = async (req, res) => {
    try {
        const transactionData = await findTransaction({ userID: req.userData._id })
        if (!transactionData) {
            res.status(404).json({
                status: "error",
                message: "Could not find the transaction",
            })
        }
        res.status(201).json({
            status: "success",
            message: "Transaction found",
            transactionData
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error fetching the transaction",
        })
    }
}

export const deleteTransaction = async (req, res) => {
    try {
        const { Tid } = req.params
        const transactionData = await findOneTransaction({ _id: Tid })

        if (transactionData.userID.toString() === req.userData._id.toString()) {

            const filteredData = await findOneAndDeleteTransaction({
                _id: Tid
            })
            res.status(201).json({
                status: "success",
                message: "Transaction Deleted",
                filteredData
            })
        } else {
            res.status(401).json({
                status: "error",
                message: "Not Authorised",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "error",
            message: "didnot find the transaction"
        })
    }
}

export const deleteMultiple = async (req, res) => {
    try {
        const { transactionsID } = req.body;
        console.log("Transaction IDs", transactionsID)
        if (!transactionsID || transactionsID.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "No transactions provided"
            })
        }
        const deletedTransactions = await delManyTransaction({
            _id: { $in: transactionsID },
            userID: req.userData._id
        })
        console.log(200, deletedTransactions)
        if (deletedTransactions.deletedCount === 0) {
            return res.status(404).json({
                status: "error",
                message: "Transactions Not Found"
            })
        }

        return res.status(200).json({
            status: "success",
            message: "Deleted successfully!",
            deletedCount: deletedTransactions.deletedCount
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "error",
            message: "Network Error"
        })
    }
}

export const updateTransaction = async (req, res) => {
    try {
        const obj = req.body
        const id = req.params.id;

        const updatedObj = await updateFinance(
            { _id: id, userID: req.userData._id },
            obj, {
            new: true
        })
        if (!updatedObj) {
            res.status(404).json({
                status: 'error',
                message: "couldnot find the transaction."
            })
        }
        res.status(201).json({
            status: "success",
            message: "updated successfully",
            updatedObj
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "error",
            message: "didnot find the transaction"
        })
    }
}