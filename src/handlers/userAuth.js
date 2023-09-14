const bcrypt = require("bcrypt");
const _ = require("lodash");
const axios = require("axios");
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer')
require("dotenv").config();
//const transporter = require('../config/emailConfig')
const { User } = require('../Model/userModel');
const { Otp } = require('../Model/otpModel');
const smtpTransport = require('nodemailer-smtp-transport');



module.exports.registerUser = async (req, res) => {
    //fetchinng data from request 
    let email = req.body.email
    /* if(!req.body.password){
        return res.status(400).json({message:"Enter password"});
    } */

    //validation and verification of  request
    if (!email) {
        return res.status(400).json({ message: "Enter email" });
    }
    const user = await User.findOne({
        email:email,
    });
    if (user) return res.status(400).send("This email already registered!");

    //generate random
    const OTP = otpGenerator.generate(6, {
        digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false
    });

    const data = await Otp({
        email: email,
        otp: OTP
    });
    console.log(data)
    //_________________________________________________________
        
        try {
            const smtpSerice = nodemailer.createTransport (smtpTransport ({
                host: 'smtp.gmail.com',
                port: "587",
                secure:false,
                requireTLS:true,
                service: 'gmail',
                auth:{
                    user:"best.com.luck.com@gmail.com",
                    pass:"Swati@123",
                }
            }));

            const mailOptions ={
                from:'"FuelCab India" <best.com.luck.com@gmail.com>' , // sender address
                to:email, // list of receivers
                subject: `User Registraion OTP`,
                text: data.otp, // plain text body
                
            };
            // send mail with defined transport object
            smtpSerice.sendMail(mailOptions,(err,info)=>{
                if(err){ 
                    console.error('Error sending email:', err);
                    res.status(500).json({ message: 'Error sending email.' });
                }
                else {
                    console.log('Email sent:', info.response);
                    res.status(200).json({ message: 'OTP sent successfully.' });
                  }
            })
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error.' });
          }

        

    //___________________________________________________________________-

    const salt = await bcrypt.genSalt(10)
    data.otp = await bcrypt.hash(data.otp, salt);

    const result = await data.save();
    res.status(200).send({ message: "Otp send successfully!", data });
}
//===========================================================================================
module.exports.verifyOtp = async (req, res) => {

    const otpHolder = await Otp.find({
        email: req.body.email
    });
    //console.log(`OTP Holder ${otpHolder[otpHolder.length-1].otp}`)

    if (otpHolder.length === 0) return res.status(400).send(`You use an Expired OTP`);

    const rightOtpFind = otpHolder[otpHolder.length - 1];
    console.log(`Right Otp Find ${rightOtpFind.otp}`)
    const validUser = await bcrypt.compareSync(req.body.otp, rightOtpFind.otp, (err, res) => {
        if (err) {
            console.log("Comparison error: ", err);
        }
    })
    if (rightOtpFind.number === req.body.number && validUser) {
        //if (rightOtpFind.number === req.body.number) {
        const user = new User(_.pick(req.body, ["email"]));
        const token = user.generateJWT();
        const result = await user.save();
        const OTPDelete = await Otp.deleteMany({
            email: rightOtpFind.email
        });


        return res.status(200).json({
            message: "User Registration Successfull!",
            token: token,
            data: result
        });
    } else {
        return res.status(400).send("Your OTP was wrong!")
    }
}
//===========================================================================================
module.exports.loginUser = async (req, res) => {
    //res.status(200).json({ message: "Currently Working on login" })
    if (!req.body.email) {
        return res.status(400).json({ message: "Enter email" }); 
    }

    const user = await User.findOne({
        email: req.body.email,
    });
    console.log(user)
  jwt.sign({user},process.env.JWT_SECRET_KEY,{expiresIn:'3000s'},(err,token)=>{
      res.json({token})
      console.log(token)
  })
}

module.exports.profile= (verifyToken,(req,res)=>{
  jwt.verify(req.token,process.env.JWT_SECRET_KEY,(err,authData)=>{
      if(err){
          res.send({result:'invalid token'})
      }else{
          res.json({
              message:'profile accessed',
              authData  
          })
      }
  })
  
})

async function verifyToken(req,res,next){
  const bearerHeader= req.headers['authorization'];
  console.log(bearerHeader)  
  if(typeof bearerHeader !=='undefined'){
      const bearer = await bearerHeader.split(" ");
      console.log(`This is bearer ${bearer}`)
      const token =bearer[1];
      console.log(`this is token${token}`)
      req.token=token;
      next()       

  }else{
      console.log(bearerHeader) 
      res.send({
          result:'Token is not valid'
      })
  }
}


//==========================================================================================

module.exports.generateOTP = async (req, res) => {
    res.status(200).json({ message: "We are Working!" });
}

