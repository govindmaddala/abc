const { ErrorHandle } = require("../helpers/Errorhandle")

exports.Path404 = (req, res, next) => {
    const error = `Path ${req.originalUrl} is not found`;
    next(new ErrorHandle(error, 404))
}