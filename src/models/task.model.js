import mongoose from "mongoose"

const validStatuses = ["not started", "pending", "completed"]

const taskSchema = new mongoose.Schema({

    status: {
        type: String,
        enum: validStatuses,
        default: "not started",
    },

    description: {
        type: String,
        required: true,
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    dueDate: {
        type: Date,
    },
},{
    timestamps: true,
})

const Task = mongoose.model("Task", taskSchema)
export default Task