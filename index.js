import { config } from "dotenv"
import express from "express"
import db_connection from "./DB/connection.js"
const app = express()
config({path: 'config/dev.env'})
const port = process.env.PORT


db_connection()


app.listen(port, console.log(`server connected successfully on port ${port}`))