const router = require("express").Router();
const userControl = require("../controller/user.control")
const {authentication,adminAuthorization} = require("../middleWare/auth.middleware")
const userupload = require ("../middleWare/uploud.middleware")
const updateUserValidation = require ("../middleWare/update-user-validation.middleware")
const Valid= require("../middleWare/inputValidation.middleware")

router.get("/showMyProfile",authentication,userControl.showMyProfile)
router.put("/updateProfile",authentication ,updateUserValidation ,
        userControl.updateUser)
router.patch("/updatePassword",authentication,Valid.updatePasswordValidation,
        userControl.updatePassword)
router.patch("/updateImage",authentication,userupload().single("image") ,
        userControl.uploadAndUpdateimage)
router.post("/uploadTranscript",authentication,
        userupload().single("application"),userControl.uploadTranscript)
router.delete("/deleteTranscript",authentication,userControl.deleteTranscript)
router.post("/uploadimage",authentication,
        userupload().single("image"),userControl.uploadAndUpdateimage)

        
router.post("/createUser",adminAuthorization,
        Valid.signUpVaIidation,userControl.createUser)
router.delete("/deleteUser",adminAuthorization,userControl.deletUser)
router.get("/getUser",adminAuthorization,userControl.getSpecificUser)
router.get("/getAllUser",adminAuthorization,userControl.getAllUser)
router.post("/blockUser",adminAuthorization,userControl.blockUser)
router.post("/unblockUser",adminAuthorization,userControl.unBlockUser)


module.exports = router;