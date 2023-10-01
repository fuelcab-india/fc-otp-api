const express = require('express');
const app = express();
const PORT = 8000;
require("dotenv").config();
const { success, error } = require("consola");
const mongoose = require('mongoose');
const otpRouter = require('./src/Routers/otpRouter');
// const bodyParser = require('body-parser');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', otpRouter);


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex:true,
}).then(()=>success({
    message: `Successfully connected with MongoDB database!`,
    badge: true,
})).catch((err)=>error({
    message: `Unable to connect with database\n ${err}`,
    badge: true,
}))



app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
  })

  module.exports=app;