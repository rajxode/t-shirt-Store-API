
// mongoose
const mongoose = require('mongoose');

// function to connect with database
const connectWithDb = () => {
    mongoose
    // connecting to database
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    // if successful
    .then(console.log('Database connected'))
    // if there is some error
    .catch((error) => {
        console.log('Error in DB connection');
        console.log(error);
        process.exit(1);
    });
}

// export connect function
module.exports = connectWithDb;