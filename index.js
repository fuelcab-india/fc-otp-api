const express = require('express');
const app = express();
const otpRouter = require('./src/Routers/otpRouter');
require("dotenv").config();

const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/apiv1', otpRouter);

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
})

module.exports=app;