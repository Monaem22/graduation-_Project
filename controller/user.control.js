const usermodel = require ("../models/User.model")
const fs = require ("fs") ;
const bcrypt = require("bcrypt");

const userController = {
showMyProfile :  async (req, res) => {
        try {
            let myID = req.user._id ;
            const myProfile = await usermodel.findById(myID);
            
            res.status(200).send({ my_Profile:  myProfile });
            
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
},
updateUser : async (req,res) => {
    try {
        await usermodel.findByIdAndUpdate(req.user._id,req.body ,{new : true})
        res.status(200).json({ message: "my profile is updated"});
    } catch (error) {
        res.status(500).send({message : error.message})
    } 
},
updatePassword : async (req,res)=>{
    try {
        let user = await usermodel.findById(req.user._id)
        let {newPassword , oldPassword} = req.body
        let validPassword = await bcrypt.compare(oldPassword,user.password)
        if(!validPassword){
            return res.status(403).send({message:"Invalid old password"})
        }
        user.password = newPassword
        await user.save()
        res.send({message:"Password Updated !!"})
    } catch (error) {
        res.status(500).send({message: error.message})
    }
},
deleteTranscript : async (req,res) => {
    try {
        const user = req.user 
        if(user.transcript){
        var pathArray = user.transcript.split("/")
        var lastIndex = pathArray.length - 1;  
        var transcriptFileName = pathArray[lastIndex]
        var transcriptPath = `Uploads-transcript\\${transcriptFileName}`
        fs.unlinkSync(transcriptPath)
        }else{
            return res.status(200).json({ message: "no transcript to delete"});
        }

        user.transcript = undefined ;
        await user.save()
        console.log("Transcript Field value removed successfully!");
        return res.status(200).json({ message: " Transcript is deleted"});
        
    } catch (error) {
        res.status(500).send({message : error.message})
    } 
},
uploadTranscript :  async (req, res) =>{
    try {
        const user = req.user 
        let ownerID = req.user._id ;
        if(!req.file){
            return res.status(404).send('no file found or check the extention of file (".pdf")')
        }
        var newTranscriptPath = `${req.baseUrl}/${req.file.filename}`
        if(user.transcript){
        var pathArray = user.transcript.split("/")
        var lastIndex = pathArray.length - 1;  
        var transcriptFileName = pathArray[lastIndex]
        var transcriptPath = `Uploads-transcript\\${transcriptFileName}`
        fs.unlinkSync(transcriptPath)
        }
        await usermodel.findByIdAndUpdate(
            ownerID,{transcript : newTranscriptPath},{new : true}
            )
        res.status(201).send("Transcript is saved")
        console.log(req.file);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
},
uploadAndUpdateimage : async (req, res) =>{
        try {
            const user = req.user 
            let ownerID = req.user._id ;
            if(!req.file){
                return res.status(404).send('no file found or check the extention of img (".png",".jpg",".jpeg")')
            }
            var newImagePath = `${req.baseUrl}/${req.file.filename}`
            if(user.image){
            var pathArray = user.image.split("/")
            var lastIndex = pathArray.length - 1;  
            var oldImageFileName = pathArray[lastIndex]
            var oldImagePath = `Uploads-image\\${oldImageFileName}`
            fs.unlinkSync(oldImagePath)
            }
            await usermodel.findByIdAndUpdate(
                ownerID,{image : newImagePath},{new : true}
                )
            res.status(201).send("image is saved")
            console.log(req.file);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
},
blockUser : async (req, res) =>{
    try {
        const userId = req.body.id
        if (!userId) {
            return res.status(404).send({ message: "there is no user id"});
        }
        const userData = await usermodel.findById(userId)
        if(!userData){
            return res.status(404).send({ message: "there is no user with this ID"});
        }
        userData.isBlocked = true ;
        await userData.save() ;
        return res.status(202).send({ message: "user is blocked successfully",user_state :"blocked"});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
},
unBlockUser : async (req, res) =>{
    try {
        const userId = req.body.id
        if (!userId) {
            return res.status(404).send({ message: "there is no user id"});
        }
        const userData = await usermodel.findById(userId)
        if(!userData){
            return res.status(404).send({ message: "there is no user with this ID"});
        }
        userData.isBlocked = false ;
        await userData.save() ;
        return res.status(202).send({ message: "user is unblocked successfully",user_state :"unblocked"});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
},
deletUser : async (req,res) =>{
    try {
        const userID = req.body.userId ;
        if (!userID) {
            return res.status(404).send({ message: "enter the user id you want to delete"});
        }
        let user = await usermodel.findByIdAndDelete(userID)
        if (!user) {
            return res.status(404).send({ message: "there is no user with this ID"});
        }
        return res.status(202).send({ message: "user is deleted"});
    } catch (error) {
        res.status(500).send({message : error.message})
    }
},
getSpecificUser : async (req, res) => {
        try {
            let userID = req.body.id ;
            if (!userID) {
                return res.status(404).send({ message: "enter the user id you want to get"});
            }
            const specficUser = await usermodel.findById(userID);
            if (!specficUser) {
                return res.status(404).send({message:`there is no user found with this id : ${userID}`}) ;
            } 
            res.status(200).send({ user_data: specficUser });
            
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
},
getAllUser : async (req, res) => {
    try {
        let role = req.body.role ;
        if (!role) {
            const AllUser = await usermodel.find();
            if (!AllUser) {
                return res.status(404).send({message:`there are no users founded `}) ;
            }
            const documentcount = await usermodel.countDocuments();
            return res.status(200).send({ 
                message: `number of documents: ${documentcount}`, ALL_users_data: AllUser });
        }else{
            const AllUserWithRole = await usermodel.find({role :role});
            if (!AllUserWithRole) {
                return res.status(404).send({message:`there is no ${role} founded `}) ;
            }
            const documentcount = await usermodel.countDocuments({role :role});
            return res.status(200).send({
                message: `number of documents: ${documentcount} `, all_users_with_role : AllUserWithRole });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
},
createUser : async (req, res) => {
    try {
        const newuser = await usermodel.create(req.body);
        res.status(201).json({ message: "newuser is created", data: newuser });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
},

}
module.exports = userController 




