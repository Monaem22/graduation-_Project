const mongoose = require("mongoose");
const warehouseDB = mongoose.model("projectsWarehouse",{
projectName: {
    type :String,
    default : "object",
},
category :{
    type :String,
    default : "General",

},
comments : {
    type :String,
},
likes : {
    type: Number,
    default : 0,
},

date : {
    type :String,
    default :Date()
},
description: {
    type: String,
    // required: true
},
status: {
    type: String,
    enum: ["pending", "accepted", "canceled"],
    default: "pending",
},
pdf: { type: String },
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users_table",
},


})

module.exports = warehouseDB;