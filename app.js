import express from "express";
import {config} from "dotenv"
import {connectDB} from "../projectRecipe/config/db.js"
import cors from 'cors';
import { errorHandler, notFound } from './middlewares/errorHandling.middleware.js';
import userRouter from "./routes/user.router.js"
import recipeRouter from "./routes/recipe.router.js"
import categoryRouter from "./routes/category.router.js"
config()
connectDB()
const app=express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use('/users',userRouter)
app.use('/recipe',recipeRouter)
app.use('/category',categoryRouter)
app.use(notFound)
app.use(errorHandler)
const port=process.env.PORT||5000
app.listen(port,()=>{
    
})
