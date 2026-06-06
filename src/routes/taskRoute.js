import {createTask, readTasks, updateTask, deleteTask, readTaskById} from "../controllers/taskController.js"
import express from "express"

const taskRouter = express.Router()

taskRouter.post('/', createTask)
taskRouter.get('/', readTasks)
taskRouter.get('/:id', readTaskById)
taskRouter.patch('/:id', updateTask)
taskRouter.delete('/:id', deleteTask)

export default taskRouter