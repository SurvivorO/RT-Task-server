import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    }
})

userSchema.pre("save", async function() {

    if(!this.isModified("password") || !this.password) {
        return
    }

    try{
        this.password = await bcrypt.hash(this.password, 10)

    }catch(err) {
        console.error("Error hashing password: ", err)

    }
})

const User = mongoose.model("User", userSchema)
export default User