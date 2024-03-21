const mongoose = require("mongoose");
const Autoincrement = require( 'mongoose-sequence')(mongoose);
const bcrypt = require("bcrypt");

const studentSchema = new mongoose.Schema({

userName :{ 
    type : String,
    required : true,
    // trim :true ,
}, 
email : {
    type :String,
    required : true,
    trim :true ,
    lowercase: true,
    unique: true 
},
password :{
    type :String,
    required : true,
    trim :true ,
},
passwordResetCode: String,
passwordResetExpires: Date,
passwordResetVerified: Boolean,
active: {
    type: Boolean,
    default: true,
},
role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
},
phone: String,
image:  {
    type : String ,
    trim : true ,
},
transcript : {
    type : String ,
    trim : true ,
},
age: {
    type: Number,
    default: 18
},  
addresses: [
    {
    details: String,
    city: String,
    postalCode: String,
    },
],
favoriteList :[{
    type: mongoose.Schema.Types.ObjectId,
    ref: ""
}],
isBlocked: {
    type: Boolean,
    default: false,
},

date: {
    type: String,
    default: new Date,
},
tokens:[{
    type:String,
    trim:true,
    Expires:"2d"
}]

})
studentSchema.plugin(Autoincrement,{
    inc_field: 'ticket',
    id:'ticketNums',
    start_seq: 1
})
studentSchema.pre('save', async function (next) {
    const isModified = this.isModified('password');
    if (!isModified) return next();  // it will save empty or default value
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const studentDB = mongoose.model("users_table",studentSchema)
module.exports = studentDB;
