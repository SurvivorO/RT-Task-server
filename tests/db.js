import mongoose from "mongoose"
import MongoMemoryServer from "mongodb-memory-server"

let mongoServer

const connectDB = async () => {
    mongoServer = await MongoMemoryServer.MongoMemoryServer.create()
    const uri = mongoServer.getUri()

    await mongoose.connect(uri)
}

const disconnectDB = async () => {
    if(mongoServer) {
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
        await mongoServer.stop()
    }
}

const clearDB = async () => {
    const collections = mongoose.connection.collections

    for(const key in collections) {
        await collections[key].deleteMany()
    }
}

export {connectDB, disconnectDB, clearDB}