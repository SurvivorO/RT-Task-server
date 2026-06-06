import {createUser, readUsers, updateUser, deleteUser, readUserById, loginUser} from "../controllers/userController.js"
import express from "express"

const userRouter = express.Router()

userRouter.post('/', createUser)
userRouter.get('/', readUsers)
userRouter.get('/:id', readUserById)
userRouter.patch('/:id', updateUser)
userRouter.delete('/:id', deleteUser)
userRouter.post('/login', loginUser)

export default userRouter