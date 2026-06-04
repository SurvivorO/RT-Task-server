import app from "./src/app.js"
import "dotenv/config"

app.listen(process.env.PORT, ()=> {
    console.log(`Server started at port ${process.env.PORT}`)
})