require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const  {connectDB}  = require("./db.js"); 
const path = require('path'); 
const userRoutes = require('./routes/userRoute');
const communityRoutes = require('./routes/communityRoutes');
const postRoutes = require('./routes/postRoutes.js');
const commentRoutes = require('./routes/commentRoutes.js');
const chatRoutes = require('./routes/chatRoutes.js');
const passport = require("passport"); 
require('./config/passport');        
const authRoutes = require('./routes/authRoutes');


const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", 
  credentials: true                
}));app.use(express.json());
app.use(passport.initialize());




app.use('/api/users', userRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chat', chatRoutes);
app.use('/auth', authRoutes);
app.use(express.static(path.join(__dirname, '../client/reddit/dist')));

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/reddit/dist', 'index.html'));
});
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));