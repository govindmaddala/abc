const { registerUser, verifyUser, addOrUpdateUsers, getAllUsers, dummy } = require('../controllers/users.controller');
const { loggerHelper } = require('../helpers/loggerHelper');

const router = require('express').Router();

router.post("/register", registerUser)
router.post("/login", verifyUser)
router.post("/addOrUpdateUsers", addOrUpdateUsers)
router.get("/all", getAllUsers)
router.get("/dummy", dummy)

module.exports = router;