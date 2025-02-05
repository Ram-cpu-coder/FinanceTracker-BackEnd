import mongoose from "mongoose";


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

transactionSchema.pre("save", function (next) {
    if (this.type === "Expense") {
        this.amount = -this.amount;
    } else if (this.type === "Income") {
        this.amount = Math.abs(this.amount)
    }
    next()
})
export default mongoose.model("Transaction", transactionSchema)