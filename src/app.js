import express from "express"
import requireApikey from "./middlewares/requireApikey.js"
import taskRouter from "./routes/taskRoute.js"
import userRouter from "./routes/userRoute.js"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/tasks', taskRouter)
app.use('/users', userRouter)

app.get('/health', requireApikey, (req, res) => {
    res.status(200)
    res.json({ status: "healthy" })
})

app.get('/', (req, res) => {

    res.status(200)
    res.send("Hello world!")
})


export default app