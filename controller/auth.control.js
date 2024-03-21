const usermodel = require("../models/User.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto");
const sendEmail = require("../Services/sendEmail");



const authUserController = {

    signUp : async(req,res) => {
        try {
            let data = req.body ;
            let existingUser = await usermodel.findOne({ email: data.email });
            if (existingUser) {
                return res.status(403).send({ 
                    error: "email is already exists..please enter another email" 
                });
            }
            let newUser = await usermodel.create(data)
            res.status(201).send("hi🤓")
        } catch (error) {
            res.status(500).send({message : error.message})
        }
        
    },
    login : async(req,res) => {
        try {
            let {email,password} = req.body ;
            let user = await usermodel.findOne({email})
            if (!user) {
                return res.status(403).send({ message: " Inavlid email or password"});
            }
            let validPassword = await bcrypt.compare(password,user.password)
            if (!validPassword) {
                return res.status(403).send({ message: " Inavlid email or password"});
            }
            if (user.isBlocked) {
                return res.status(403).send({ message: " you can't login...you are blocked...Contact the admin to help"});
            }
            const token = await jwt.sign({id:user._id},process.env.secret_key)
            res.cookie("access_token",`barear ${token}`,{
                httpOnly:true,
                maxAge:60*60*24*2
            })
            user.tokens.push(token)
            await user.save()

            // console.log("login\n",token)
            res.status(200).send("hi🤓")
        } catch (error) {
            res.status(500).send({message : error.message})
        }
        
    },
    logout : (req, res) => {
        try {
        res.clearCookie("access_token");
        console.log("logedOut");
        res.status(200).send("you are loged out")
    } catch (error) {
        res.status(500).send({message : error.message})
    }
    },
    forgetPassword : async (req, res) => {
        try {
        var userDoc = await usermodel.findOne({ email: req.body.email });
        if (!userDoc) {
            return res.status(403).send({ message: "Email not found"});
        }
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashResetCode = crypto.createHash("sha256")
            .update(resetCode)
            .digest("hex");
            
        userDoc.passwordResetCode = hashResetCode;
        userDoc.passwordResetExpires = Date.now() + 10 * 60 * 1000;
        userDoc.passwordResetVerified = false;
        await userDoc.save();
        
        var message = ` HI ${userDoc.userName} ,
        we received to rest the password on your graduation_Project account \n
            ${resetCode} thanks to me`;
            console.log(resetCode);
        await sendEmail({
            email: userDoc.email,
            subject: `your password reset code(valid for 10 min)`,
            text: message,
        });
        return res.status(200).json({ status: "Success", message: "mail sent" });
        
        } catch (error) {
            userDoc.passwordResetCode = undefined;
            userDoc.passwordResetExpires = undefined;
            userDoc.passwordResetVerified = undefined;
            await userDoc.save();
        
        res.status(500).send({message : error.message})
        }
    },
    verifyPassResetCode : async (req, res) => {
        // 1) Get user based on reset code
        const hashedResetCode = crypto
            .createHash("sha256")
            .update(req.body.resetCode)
            .digest("hex");
        
        const user = await usermodel.findOne({
            passwordResetCode: hashedResetCode,
            passwordResetExpires: { $gt: Date.now() },
        });
        if (!user) {
          // return next(new ApiError("Reset code invalid or expired"));
            return res.status(404).send({ message: "Reset code invalid or expired"});
        }
        // 2) Reset code valid
        user.passwordResetVerified = true;
        await user.save();
        res.status(200).json({ status: "Success" });
    },
    resetPassword : async (req, res) => {
        try {
        const user = await usermodel.findOne({ email: req.body.email });
        if (!user) {
                return res.status(404).send({ message: `There is no user with email ${req.body.email}`});
        }
        // 2) Check if reset code verified
        if (!user.passwordResetVerified) {
                return res.status(404).send({ message: "Reset code not verified"});
            
        }
        user.password = req.body.newPassword;
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;
        await user.save();
        // 3) if everything is ok, generate token
        const token =await jwt.sign({ id: user._id }, process.env.secret_key, {
            expiresIn: "90d",
        });
        res.cookie("access_token",`barear ${token}`,{
            httpOnly:true,
            maxAge:60*60*24*2
        })
        res.status(200).json({ message: "success", token });
        } catch (error) {
        res.status(500).send({message : error. message})
        }
    },
}

module.exports = authUserController;
