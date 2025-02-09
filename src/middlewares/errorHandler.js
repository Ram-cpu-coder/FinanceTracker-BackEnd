export const errorHandler = (error, req, res, next) => {
    if (!error.statusCode) {
        error.statusCode = 500;
        error.message = error.message || "internal error";
    }
    let type = error.type || "Normal";

    if (error.message.includes("E11000")) {
        error.statusCode = 400;
        error.message = "DUPLICATE USER"
    }


    if (error.statusCode >= 500) {
        return res.status(error.statusCode).json({
            status: "error",
            message: error.message,
            type
        })
    }
    next()

}