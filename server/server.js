require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./db"); 

const userRoutes = require('./routes/userRoute');
const communityRoutes = require('./routes/communityRoutes');
const postRoutes = require('./routes/postRoutes.js');
const commentRoutes = require('./routes/commentRoutes.js');


const app = express();
app.use(cors({
  origin: "http://localhost:5173", // The URL of your frontend (from your screenshot)
  credentials: true                // Allow cookies/tokens
}));app.use(express.json());

connectDB()



app.use('/api/users', userRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/posts', postRoutes);
app.use('api/comments', commentRoutes);


const PORT = process.env.PORT || 3000;
app.listen(3000, () => console.log(`🚀 Server running on port ${PORT}`));