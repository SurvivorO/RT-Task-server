import {createUser, readUsers, updateUser, deleteUser} from "../controllers/userController.js"
import express from "express"

const userRouter = express.Router()

userRouter.post('/', createUser)
userRouter.get('/', readUsers)
userRouter.patch('/:id', updateUser)
userRouter.delete('/:id', deleteUser)

export default userRouter