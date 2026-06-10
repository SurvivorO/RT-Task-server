import { createTask, readTasks, updateTask, deleteTask, readTaskById } from "../controllers/taskController.js"
import express from "express"
import checkAuth from "../middlewares/auth.middleware.js"

const taskRouter = express.Router()

taskRouter.post('/', checkAuth, createTask)
taskRouter.get('/', checkAuth, readTasks)
taskRouter.get('/:id', checkAuth, readTaskById)
taskRouter.patch('/:id', checkAuth, updateTask)
taskRouter.delete('/:id', checkAuth, deleteTask)

export default taskRouter