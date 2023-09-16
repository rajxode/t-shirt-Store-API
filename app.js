
// for environment variables
require('dotenv').config();

// express
const express = require('express');

// logger
const morgan = require('morgan');

// app 
const app = express();

// for cookies
const cookieParser = require('cookie-parser');
// for uploading files
const fileUpload = require('express-fileupload');


// for api-docs
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middlewares
// for parsing entered data { json, url data }
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
// for cookie
app.use(cookieParser());
// for uploading files
app.use(fileUpload({
        useTempFiles: true,
        tempFileDir:"/tmp/",
    })
);
// logger 
app.use(morgan('tiny'));
 

// routes
app.use('/api/v1',require('./routes/home'));


// export the app
module.exports = app;