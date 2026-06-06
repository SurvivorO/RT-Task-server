import {createTask, readTasks, updateTask, deleteTask} from "../controllers/taskController.js"
import express from "express"

const taskRouter = express.Router()

taskRouter.post('/', createTask)
taskRouter.get('/', readTasks)
taskRouter.put('/:id', updateTask)
taskRouter.delete('/:id', deleteTask)

export default taskRouter