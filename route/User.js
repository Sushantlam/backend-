const express = require("express")
const router = express.Router()
const {createUser, loginUser, updateUser, getAll, getById, deleteById, verifyEmail}= require("../controller/UserController")
const { verifyToken, verifyUser, verifyAdmin } = require("../verify/verify")

router.post("/signup", createUser)
router.post("/login", loginUser)
router.put("/profile/:id",  updateUser)
router.get("/profile/:id",  getById)
router.delete("/profile/:id",  deleteById)
router.get("/verify/:id",  verifyEmail)
router.get("/all",  getAll)


module.exports= router