export const errorHandler = (error, req, res, next) => {
    let statuscode = error?.statusCode || 500;
    let message = error?.message || "internal error";
    let type = "Normal";

    if (message.includes("E11000")) {
        statuscode = 400;
        message = "DUPLICATE USER"
    }

    if (error?.type) {
        type = error.type
    }

    return res.status(statuscode).json({
        status: "error",
        message: message,
        type
    })

}