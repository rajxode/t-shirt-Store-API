
const mongoose = require('mongoose');

const connectWithDb = () => {
    mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log('Database connected'))
    .catch((error) => {
        console.log('Error in DB connection');
        console.log(error);
        process.exit(1);
    });
}

module.exports = connectWithDb;