import {createUser, readUsers, updateUser, deleteUser, readUserById} from "../controllers/userController.js"
import express from "express"

const userRouter = express.Router()

userRouter.post('/', createUser)
userRouter.get('/', readUsers)
userRouter.get('/:id', readUserById)
userRouter.patch('/:id', updateUser)
userRouter.delete('/:id', deleteUser)

export default userRouter