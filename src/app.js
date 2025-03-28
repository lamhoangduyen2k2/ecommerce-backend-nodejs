import "dotenv/config"
import express from 'express';
import morgan from 'morgan';
import helmet from "helmet";
import compression from "compression"
import routes from "./routes/index.js";

//init db
import "./dbs/init.mongodb.js"
import { checkOverload } from "./helpers/check.connect.js";
import {Error} from "mongoose";


const app = express();

//init middlewares
app.use(morgan('dev'));
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//init db
checkOverload()
//init routes
app.use("/", routes)
//handling error
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        message: error.message || "Internal Server Error",
    })
})
export default app;