
require('dotenv').config();
const connectWithDb = require('./config/mongoose');
const app = require('./app');

connectWithDb();

const {PORT} = process.env;

app.listen(PORT,() => {
    console.log(`Server is running on port: ${PORT}`);
})