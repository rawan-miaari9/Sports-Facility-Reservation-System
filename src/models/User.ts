import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    phone:String,

    dateOfBirth:String,

    role:{
        type:String,
        enum:["user", "admin"],
        default:"user"
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});


export default mongoose.models.User ||
mongoose.model("User", UserSchema);
