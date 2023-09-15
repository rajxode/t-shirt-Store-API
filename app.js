
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');


const app = express();

const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));

app.use(cookieParser());
app.use(fileUpload());

app.use(morgan('tiny'));

app.use('/api/v1',require('./routes/home'));

module.exports = app;