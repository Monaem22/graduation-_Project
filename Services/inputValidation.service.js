const Joi = require("joi")

const validation = {
    signUpSchema :Joi.object({
        userName : Joi.string()
            .required()
            ,
        email : Joi.string()
            .email()
            .required()
            .lowercase(true)
            ,
        password: Joi.string()
            .pattern(new RegExp(/^[a-zA-Z0-9]{3,30}$/))
            .required()
            .min(8)
            ,
    }),
    loginSchema :Joi.object({
        email : Joi.string()
            .email()
            .required()
            ,
        password: Joi.string()
            .pattern(new RegExp(/^[a-zA-Z0-9]{3,30}$/))
            .required()
            .min(8)
            ,
    }),
    updatePassword :Joi.object({
        oldPassword : Joi.string()
            .pattern(new RegExp(/^[a-zA-Z0-9]{3,30}$/))
            .required()
            .min(8)
            ,
        newPassword: Joi.string()
            .pattern(new RegExp(/^[a-zA-Z0-9]{3,30}$/))
            .required()
            .min(8)
            ,
    })
}
module.exports = validation
