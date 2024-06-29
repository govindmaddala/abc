exports.users = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dateOfBirth: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        timeStamp: true
    })
};



// models/index.js
// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('mean', 'postgres', '2107', {
//     host: 'localhost',
//     dialect: 'postgres',
// });
// const userModel = sequelize.define('users', {
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     email:{
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     age: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
//     gender: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     }
// },{
//     sequelize,
//     timeStamp: true
// })

// userModel.findOne()

