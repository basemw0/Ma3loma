const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoute');
const communityRoutes = require('./routes/communityRoute');

app.use('/api/users', userRoutes);
app.use('/api/communities', communityRoutes);