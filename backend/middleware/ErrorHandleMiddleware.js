exports.ErrorHandleMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Inernal Server Error';
    let stack = err.stack;
    if (process.env.ENV === "PROD") {
        if (err.stack.split("\n").length > 0) {
            stack = err.stack.split("\n")[0]
        }
    }else{
        let errorStack = err.stack.split("\n")
        console.log("===============================[Error Logs]===============================")
        console.log(errorStack[0])
        console.log(errorStack[1])
        console.log("===============================[Error Logs]===============================")
    }
    return res.status(err.statusCode).json({
        message: err.message,
        stack: stack
    })
}