// 1. Correct the verification part of otp by updating the otp for the same number in database


const { Otp } = require('../Models/otpModel');
const _ = require("lodash");
const CryptoJS = require("crypto-js");
const otpGenerator = require('otp-generator');
require("dotenv").config();



// Store OTPs and timers for resend in an object
let otpData = {};
let onceClicked=0;
module.exports.sendOtp = async (req, res) => {
  if(onceClicked===0)
  {
    try {
      // Fetch data from the request
      let phoneNo = req.body.phoneNo;
      onceClicked=1;
      if(!phoneNo)
      {
        res.status(400).send('Enter Phone number');
        phoneNo=req.body.phoneNo
      }
  
      // Check if an OTP has already been sent within the last 60 seconds
      if (otpData[phoneNo] && Date.now() - otpData[phoneNo].timestamp < 60000) {
        return res.status(400).json({ message: 'Already otp send' });
      }
      // Generate a new OTP
      const OTP = otpGenerator.generate(6, {
        digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false,
      }); 
      console.log(OTP);
  
      // Store the OTP and timestamp for future reference
      otpData[phoneNo] = {
        otp: OTP,
        timestamp: Date.now(),
      };
  
      const encryptedOtp = CryptoJS.AES.encrypt(OTP, 'Secret Passphrase');
  
      // Save OTP to the database
      const data = await Otp.create({
        phoneNo: phoneNo,
        otp: encryptedOtp.toString(),
      });

      
  
      return res.status(200).json({
        message: 'OTP sent successfully',
        result: data,
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  else{
    return res.status(400).json({ message: 'Wrong Method Called' });
  }

};
  
  module.exports.verifyOtp = async (req, res) => {
    try {
      const otpHolder = await Otp.find({
        phoneNo: req.body.phoneNo,
      });
  
      if (otpHolder.length === 0) return res.status(400).send('You used an expired OTP');
      const { phoneNo, otp } = req.body;
  
      const rightOtpFind = otpHolder[otpHolder.length - 1];
      console.log(`Right OTP Find ${rightOtpFind.otp}`);
  
      var decryptedOtp = CryptoJS.AES.decrypt(rightOtpFind.otp, 'Secret Passphrase');
      decryptedOtp = decryptedOtp.toString(CryptoJS.enc.Utf8);
  
      if (decryptedOtp && decryptedOtp === otp) {
        // OTP is valid
        res.json({ message: 'OTP verified successfully' });
      } else {
        // Invalid OTP
        res.status(400).json({ error: 'Invalid OTP' });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  

};
    


module.exports.resendOtp = async (req, res) => {
  if(onceClicked===1)
  {
    let data;
    try 
  {
    // Fetch data from the request
    let phoneNo = req.body.phoneNo;

    if(!phoneNo)
    {
      res.status(400).send('Enter Phone number');
      phoneNo=req.body.phoneNo
    }
    // Generate a new OTP
    if (otpData[phoneNo] && Date.now() - otpData[phoneNo].timestamp < 60000) {
      return res.status(400).json({ message: 'Already otp send' });
    }
    else
    if (!otpData[phoneNo].timestamp || Date.now() - otpData[phoneNo].timestamp >= 60000) {
      // Generate and send the OTP
      const OTP = otpGenerator.generate(6, {
        digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false,
      }); 
    
      console.log(OTP);

      // Store the OTP and timestamp for future reference
      otpData[phoneNo] = {
        otp: OTP,
        timestamp: Date.now(),
      };

      const encryptedOtp = CryptoJS.AES.encrypt(OTP, 'Secret Passphrase');

      // Save OTP to the database
      data = await Otp.findOneAndUpdate(
        {phoneNo: phoneNo},
        {otp: encryptedOtp.toString()},
        {
          new: true,
          upsert: true
        }
      );
    
      // Schedule OTP resend after 60 seconds
      setTimeout(() => {
      // Remove the OTP data for this phone number after the resend interval
      delete otpData[phoneNo];
      }, 60000); // 60 seconds in milliseconds
    }
    return res.status(200).json({
      message: 'OTP sent successfully',
      result: data,
    });
  } 
  catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
  }
  
};
  

