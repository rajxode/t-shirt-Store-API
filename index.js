
require('dotenv').config();
const connectWithDb = require('./config/mongoose');
const app = require('./app');
const cloudinary = require('cloudinary');

connectWithDb();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
})

const {PORT} = process.env;

app.listen(PORT,() => {
    console.log(`Server is running on port: ${PORT}`);
})