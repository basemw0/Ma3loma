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
app.use(cors());
app.use(express.json());

connectDB()



app.use('/api/users', userRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/posts', postRoutes);
app.user('api/comments', commentRoutes);


const PORT = process.env.PORT || 5000;
app.listen(5000, () => console.log(`🚀 Server running on port ${PORT}`));