import { config } from "dotenv"
import express from "express"
import db_connection from "./DB/connection.js"
import { globalResponse } from "./src/middlewares/globalResponses.js"
import userRouter from "./src/modules/user/user.router.js"
const app = express()
config({path: 'config/dev.env'})
const port = process.env.PORT

app.use(express.json())
db_connection()
app.use('/user', userRouter)
app.use(globalResponse)

app.listen(port, console.log(`server connected successfully on port ${port}`))