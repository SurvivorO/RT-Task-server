import mongoose from "mongoose";
import "dotenv/config"

const connectDB = async () => {
    const uri = process.env.MONGO_URI
    if (!uri) {
        console.error("MONGO_URI is not defined in environment variables")
        process.exit(1)
    }

    const dbName = process.env.MONGO_DB_NAME
    if(!dbName) {
        console.error("MONGO_DB_NAME is not defined in environment variables")
        process.exit(1)
    }

    try {
        await mongoose.connect(uri, {
            dbName: dbName
        })
        console.log("Connected to MongoDB: ", dbName)
    }catch(err) {
        console.error("Error connecting to MongoDB: ", err)
        process.exit(1)
    }
}

const closeDB = async () => {
    try {
        await mongoose.connection.close()
        console.log("MongoDB connection closed")
    }catch(err) {
        console.error("Error closing MongoDB connection: ", err)
    }
}

export {connectDB, closeDB}