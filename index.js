
// for environment variables
require('dotenv').config();

// database
const connectWithDb = require('./config/mongoose');

// importing app from app.js
const app = require('./app');

// cloudinary for uploading image
const cloudinary = require('cloudinary');

// connect to database
connectWithDb();

// cloudinary config
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
})


// port
const {PORT} = process.env;


// fire up the server
app.listen(PORT,() => {
    console.log(`Server is running on port: ${PORT}`);
})