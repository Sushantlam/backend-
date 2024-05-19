const mongoose= require("mongoose")

const user = new mongoose.Schema({
    email:{
        type: String,
        required:true,
       
    },
    password:{
        type:String,
        required:true
    },
    images:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    userName:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false,
        required:true
    },
    isVerify:{
        type:Boolean,
        default:false,
        required:true
    }
})

const userSchema = mongoose.model("user", user)

module.exports = userSchema