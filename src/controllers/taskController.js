import Task from "../models/task.model.js"
import mongoose from "mongoose"

const createTask = async (req, res) => {
    const data = req.body
    
    try{
        await Task.create({
            status: data.status,
            description: data.description,
            assignedTo: new mongoose.Types.ObjectId(data.assignedTo),
            dueDate: data.dueDate,
        })

        res.status(201).json({message: "Task created successfully"})
    }
    catch(err) {
        console.error("Error creating task: ", err)
        res.status(500).json({error: "Failed to create task"})
    }
}

const readTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
        res.status(200).json(tasks)
        
    }catch (err) {
        console.error("Error reading tasks: ", err)
        res.status(500).json({error: "Failed to read tasks"})
    }
}

const updateTask = async (req, res) => {
    const id = req.params.id
    const data = req.body

    const updatedData = {}

    if(data.description) updatedData.description = data.description
    if(data.status) updatedData.status = data.status
    if(data.dueDate) updatedData.dueDate = data.dueDate

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, 
            { $set: updatedData },
            { returnDocument: "after", runValidators: true }
        )

        if(!updatedTask) {
            return res.status(404).json({error: "Task not found"})
        }

        res.status(200).json({ message: "Task updated successfully", task: updatedTask })

    }catch(err) {
        console.error("Error updating task: ", err)
        res.status(500).json({error: "Failed to update task"})
    }   
}

const deleteTask = async (req, res) => {
    const id = req.params.id

    try {
        const deletedTask = await Task.findByIdAndDelete(id)

        if(!deletedTask) {
            return res.status(404).json({error: "Task not found"})
        }

        res.status(200).json({ message: "Task deleted successfully" })
        
    }catch(err) {
        console.error("Error deleting task: ", err)
        res.status(500).json({error: "Failed to delete task"})
    }
}


export {createTask, readTasks, updateTask, deleteTask}