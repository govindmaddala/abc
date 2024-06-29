const bcrypt = require('bcrypt');
const { getByField, insertData, updateData, getData } = require('../models/services/dbServices');
const { catchAsyncErrors } = require('../helpers/CatchAsyncErrors');
const { ErrorHandle } = require('../helpers/Errorhandle');
const { userModal } = require('../models/connectDB');
const saltRounds = process.env.SALT_ROUNDS;

exports.dummy = catchAsyncErrors(async (req,res,next)=>{
    res.json({message: "from dummy"})
    next();
})

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    let { name, email, password, age, gender } = req.body;
    if (!name || !email || !password || !age || !gender) return next(new ErrorHandle("Important details are missing", 400));

    let userFound = await getByField(userModal, "email", email)
    if (userFound.succes) {
        return next(new ErrorHandle("User already exists", 403))
    }
    bcrypt.hash(password, parseInt(saltRounds)).then(async function (hash) {
        let userData = {
            ...req.body,
            password: hash
        }
        let data = await insertData(userModal, userData)
        if (data.succes) {
            return res.status(201).json({ message: "User is created" })
        } else {
            return next(new ErrorHandle("Error in user creation", 400))
        }
    }).catch((err) => {
        return next(new ErrorHandle(err, 500))
    });
})

exports.verifyUser = catchAsyncErrors(async (req, res, next) => {
    let { email, password } = req.body;
    if (!email || !password) return next(new ErrorHandle("Important details are missing", 400));
    let userFound = await getByField(userModal, "email", email)
    if (!userFound.succes) {
        if (!userFound.data) return next(new ErrorHandle("No user found", 400));
        if (userFound.data) return next(new ErrorHandle(userFound.data, 400));
    }
    bcrypt.compare(password, userFound?.data[0]?.password).then(function (result) {
        if (result) return res.json({ message: true }).status(200);
        if (!result) return next(new ErrorHandle("Wrong username or password", 400));
    }).catch((err) => {
        return next(new ErrorHandle(err, 500))
    });
})

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    let excludeList = [
        "password", "createdAt", "updatedAt"
    ]
    let allData = await getData(userModal, excludeList)
    if (allData.succes) {
        return res.json({ data: allData.data })
    } else {
        return next(new ErrorHandle(allData.data, 500))
    }
})

exports.addOrUpdateUsers = catchAsyncErrors(async (req, res, next) => {
    let { users } = req.body;
    if (!users || !Array.isArray(users) || users.length === 0) return next(new ErrorHandle("Important details are missing", 400));
    let newAdded = 0;
    let updated = 0;
    for await (let each of users) {
        let { isModified, email } = each;
        let userFound = await getByField(userModal, "email", email)
        console.log("each", userFound)
        if (!userFound.succes && !userFound.data) {
            bcrypt.hash("12345678", parseInt(saltRounds)).then(async function (hash) {
                let userData = {
                    ...each,
                    password: hash
                }
                // console.log("userData", userData)
                let data = await insertData(userModal, userData)
                // if (!data.succes) {
                //     return next(new ErrorHandle("Error in user creation", 400))
                // }
                if (data.succes) {
                    newAdded++;
                    // console.log("newAdded", newAdded)
                }
            }).catch((err) => {
                return next(new ErrorHandle(err, 500))
            });
            continue;
        }
        if (isModified) {
            delete each["password"]
            let resp = await updateData(userModal, "email", email, each);
            // if (!resp.succes) return next(new ErrorHandle(resp.data, 400));
            if (resp.succes) updated = updated + 1;
        } else {
            continue;
        }
    }

    return res.json({ message: true }).status(200);
})