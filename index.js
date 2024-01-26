import { config } from "dotenv"
import express from "express"

import db_connection from "./DB/connection.js"
import { globalResponse } from "./src/middlewares/globalResponses.js"
import userRouter from "./src/modules/user/user.router.js"
import companyRouter from './src/modules/company/company.router.js'
import jobRouter from './src/modules/job/job.router.js'

const app = express()
config({path: 'config/dev.env'})
const port = process.env.PORT

db_connection() 
app.use(express.json())
app.use('/user', userRouter)
app.use('/company', companyRouter)
app.use('/job', jobRouter)
app.use(globalResponse)

app.listen(port, console.log(`server connected successfully on port ${port}`))