import app from "./src/app.js"
import "dotenv/config"

//Start the server
app.listen(process.env.PORT, ()=> {
    console.log(`Server started at port ${process.env.PORT}`)
})