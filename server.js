import app from "./src/app.js"
import "dotenv/config"
import {connectDB, closeDB} from "./src/database.js"

await connectDB()

//Start the server
app.listen(process.env.PORT, ()=> {
    console.log(`Server started at port ${process.env.PORT}`)
})

process.on('SIGINT', async () => {
    console.log("Shutting down server...")
    await closeDB()
    process.exit(0)
})