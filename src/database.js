import {MongoClient, Db, Collection} from "mongodb"

let client
let db

const connectDB = async () => {

    if(db) {
        return db
    }

    const uri = process.env.MONGO_URI

    if(!uri) {
        throw new Error("MONGO_URI is not defined in environment variables")
    }

    try{
        client = new MongoClient(process.env.MONGO_URI)
        await client.connect()
        db = client.db(process.env.MONGO_DB_NAME)
        console.log("Connected to MongoDB: ", db.databaseName)        
        return db
    }catch(err) { 
        console.error("Error connecting to MongoDB: ", err)
        throw err
    }
}

const closeDB = async () => {
    if(client) {
        await client.close()
        console.log("MongoDB connection closed")
    }
}

export {connectDB, closeDB}