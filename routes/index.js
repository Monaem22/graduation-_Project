const router = require("express").Router();
const userRouter = require("./user.route");
const authRouter = require("./auth.route");


router.use("/auth",authRouter)
router.use("/user",userRouter)

module.exports = router;