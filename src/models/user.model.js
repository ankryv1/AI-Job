import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique:true,
        required: [true, "Username is required"],
        trim: true
    },
    email:{
        type: String,
        unique: [true, "Email already exists"],
        required:[true,"email is required"],
        lowercase: true
    },
    password:{
        type: String,
        required:[true, "Password is required"]
    }
})

userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return;
    }
    const hashP = bcrypt.hash(this.password, 10)
    this.password = hashP;
})

userSchema.models.checkPassword = async function(password){
    return bcrypt.compare(password, this.password)
}

export const UserModel = mongoose.model("User", userSchema);