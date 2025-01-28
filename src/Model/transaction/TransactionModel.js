import transactionModel from "./TransactionSchema.js";

export const findTransaction = (tObj) => {
    return transactionModel.find(tObj)
}

export const findOneTransaction = (tObj) => {
    return transactionModel.findOne(tObj)
}
export const findOneAndDeleteTransaction = (Tid) => {
    return transactionModel.findOneAndDelete(Tid)
}
export const delManyTransaction = (tObj) => {
    return transactionModel.deleteMany(tObj)
}
export const createTransaction = (tObj) => {
    return transactionModel(tObj).save();
}