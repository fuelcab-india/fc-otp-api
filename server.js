const express = require('express');
const app = express();
const PORT = 8000;
const CryptoJS = require("crypto-js");
const otpGenerator = require('otp-generator');
const bodyParser = require('body-parser');
const { users } = require('./seed');


app.use(bodyParser.json());


// Route to send OTP to a user's email
app.post('/send-otp', (req, res) => {
  const { email } = req.body;
  if(!users[email])
  {
    const otp = otpGenerator.generate(6, {
        digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false
    });
    // console.log(otp);
      var encrypted_otp = CryptoJS.AES.encrypt(otp, "Secret Passphrase");
      users[email] = encrypted_otp.toString(); // Store OTP in local data
    // console.log(users[email]);
      res.json({ message: 'OTP sent successfully' });
  }
  else{
    res.json({message:'Already otp send'});
  }
});

// Route to verify the OTP
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    // console.log(otp);
    // console.log(users[email]);
    var decrypted_otp = CryptoJS.AES.decrypt(users[email], "Secret Passphrase");
    decrypted_otp = decrypted_otp.toString(CryptoJS.enc.Utf8);
    // console.log(decrypted_otp);
    if (decrypted_otp && decrypted_otp === otp) { // Change 'OTP' to 'otp' here
      // OTP is valid
      delete users[email]; // Remove the OTP from local data
      res.json({ message: 'OTP verified successfully' });
    } else {
      // Invalid OTP
      res.status(400).json({ error: 'Invalid OTP' });
    }
  });

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })