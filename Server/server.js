// npm install express - backend framework for node.js
//  cors - allow to access backend from frontend
// dotenv - store environment variables in .env file
// mongoose  - connect to mongodb database
// axios - make http requests from frontend to backend
//  cloudinary - upload images to cloudinary 

import express from 'express';
import cors from 'cors'; 
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";


const app = express()
const port = 3000;

await connectDB()


// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())

//Api routes
app.get('/', (req, res) =>  res.send('Server is running'))
app.use('/api/inngest', serve({ client: inngest, functions }))



app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
