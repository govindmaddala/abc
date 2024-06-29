const { catchAsyncErrors } = require("./CatchAsyncErrors");

exports.loggerHelper = catchAsyncErrors(async (req,res,next)=>{
    logger.info("Logged from loggerHelper: " + req.originalUrl);
})