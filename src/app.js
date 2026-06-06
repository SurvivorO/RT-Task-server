import express from "express"
import requireApikey from "./middlewares/requireApikey.js"

const app = express()

app.use(express.json())

app.get('/health', requireApikey, (req, res) => {
    res.status(200)
    res.json({status: "healthy"})    
})

app.get('/', (req, res) => {

    res.status(200)
    res.send("Hello world!")
})


export default app