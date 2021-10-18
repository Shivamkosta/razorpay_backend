const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require("./database/connection");

const app = express();
require('dotenv').config();

// use middleware
app.use(bodyParser.json());
app.use(cors());

// DB Connection
connectDB();

// import routes
const paymentRoute = require('./routes/paymentRoute');

// use routes
app.use('/api',paymentRoute);

const port = process.env.PORT || 5500;

app.listen(port,() => console.log(`Server is running on port ${port}`));
