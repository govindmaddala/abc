exports.catchAsyncErrors = (fxn)=>{
    return (req,res,next)=>{
        Promise.resolve(fxn(req,res,next)).catch(next)
    }
}