import User from "../models/user.model.js"
import "dotenv/config"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const createUser = async (req, res) => {
    const data = req.body

    try{
        const user = await User.create({
            email: data.email,
            password: data.password,
            displayName: data.displayName
        })

        res.status(201).json({
            email: user.email,
            displayName: user.displayName,
            _id: user._id
        })
    }catch(err) {
        console.error("Error creating user: ", err)
        if(err.name === "ValidationError"){
            res.status(400).json({error: "Invalid user dataformat"})
            return
        } 
        if(err.code === 11000){
            res.status(400).json({error: "Email already exists"})
            return
        }
        
        res.status(500).json({error: "Failed to create user"})
    } 

}
const readUsers = async (req, res) => {

    try {
        const { ids } = req.query

        if(ids) {
            const idArray = ids.split(",")
            const users = await User.find({ _id: { $in: idArray } })
            return res.status(200).json(users)
        }

        const allUsers = await User.find()
        res.status(200).json(allUsers)
    }catch(err){
        console.error("Error reading users: ", err)
        res.status(500).json({error: "Failed to read users"})
    }
}
const readUserById = async (req, res) => {
    const id = req.params.id

    try{
        const user = await User.findById(id)
        if(!user) {
            return res.status(404).json({error: "User not found"})
        }
        res.status(200).json(user)
    }catch(err) {
        console.error("Error reading user: ", err)
        res.status(500).json({error: "Failed to read user"})
    }
}
const updateUser = async (req, res) => {
    const id = req.params.id
    const data = req.body
    const updatedData = {}

    if(data.email) updatedData.email = data.email
    if(data.password) updatedData.password = data.password
    if(data.displayName) updatedData.displayName = data.displayName

    try {
        const updatedUser = await User.findByIdAndUpdate(id,
            { $set: updatedData },
            { returnDocument: "after", runValidators: true }
        )
    }catch(err) {
        console.error("Error updating user: ", err)
        res.status(500).json({error: "Failed to update user"})
    }
}
const deleteUser = async (req, res) => {
    const id = req.params.id
    try {
        const deletedUser = await User.findByIdAndDelete(id)
        if(!deletedUser) {
            return res.status(404).json({error: "User not found"})
        }
        res.status(200).json({ message: "User deleted successfully" })
    }catch(err) {
        console.error("Error deleting user: ", err)
        res.status(500).json({error: "Failed to delete user"})
    }
}

const loginUser = async (req, res) => {

    const data = req.body
    if(!data.email || !data.password) {
        return res.status(400).json({error: "Email and password are required"})
    }

    try {
        const user = await User.findOne({ email: data.email })
        if(!user) {
            return res.status(401).json({error: "Invalid credentials"})
        }

        const isMatch = await bcrypt.compare(data.password, user.password)
        if(!isMatch) {
            return res.status(401).json({error: "Invalid credentials"})
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
        )

        res.status(200).json({ token })

    }catch(err) {
        console.error("Error during login: ", err)
        return res.status(500).json({error: "Internal server error"})
    }
}
export {createUser, readUsers, updateUser, deleteUser, readUserById, loginUser}