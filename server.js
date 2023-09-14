const express = require('express');
const { success, error } = require("consola");
require("dotenv").config();
const mongoose = require('mongoose');
const userRouter = require('./src/routers/userRouter');


//const PORT=8082
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/user', userRouter);

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    //useCreateIndex:true,
}).then(()=>success({
    message: `Successfully connected with MongoDB database!`,
    badge: true,
})).catch((err)=>error({
    message: `Unable to connect with database\n ${err}`,
    badge: true,
}))

app.listen(process.env.PORT,()=>{
    success({
        message: `Server running at http://127.0.0.1:${process.env.PORT}/`,
        badge: true,
    });
})