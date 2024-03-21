const mongoose = require ("mongoose");
const historyDB = mongoose.model("History",{

date :{
    default : date(),
},
NameOfUser : {
    type : String,
    // default : 

},
action :{

},




})

module.exports = historyDB ;