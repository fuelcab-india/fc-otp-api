const _ = require("lodash");
const CryptoJS = require("crypto-js");
const otpGenerator = require('otp-generator');
require("dotenv").config();

const SECRET_KEY = "Secret Passphrase";

// Store OTPs and timers for resend in an object
let OTPSTORE = {};

module.exports.sendOtp = async (req, res) => {
  try {
    // Fetch data from the request
    const phoneNumber = req.body.phoneNumber;
    if (!phoneNumber) {
      res.status(400).send('Enter Phone number');
    }

    // Check if an OTP has already been sent within the last 60 seconds
    if (OTPSTORE[phoneNumber] && Date.now() - OTPSTORE[phoneNumber].timestamp < 60000) {
      return res.status(400).json({ message: 'Already otp send' });
    }

    // Generate a new OTP
    const OTP = otpGenerator.generate(6, {
      digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false,
    });
    console.log(OTP);

    // encrypt the otp before sending
    const encryptedOtp = CryptoJS.Rabbit.encrypt(OTP, SECRET_KEY);

    // Store the OTP and timestamp for future reference
    delete OTPSTORE[phoneNumber];
    OTPSTORE[phoneNumber] = {
      otp: encryptedOtp,
      timestamp: Date.now(),
    };

    res.status(200).json({
      message: 'OTP sent successfully',
      result: {
        phoneNumber: phoneNumber,
        otp: encryptedOtp.toString(),
      }
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // check if otp exist in store
    if (!OTPSTORE[phoneNumber]) return res.status(400).send('Invalid OTP');

    if (Date.now() - OTPSTORE[phoneNumber].timestamp > 60000) {
      delete OTPSTORE[phoneNumber]
      return res.status(400).send('OTP expired');
    }

    // decrypt before conparision
    let decryptedOtp = CryptoJS.Rabbit.decrypt(OTPSTORE[phoneNumber].otp, SECRET_KEY);
    decryptedOtp = decryptedOtp.toString(CryptoJS.enc.Utf8);

    if (decryptedOtp && decryptedOtp === otp) {
      delete OTPSTORE[phoneNumber]
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



