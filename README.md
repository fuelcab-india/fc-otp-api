# fc-otp-api
# OTP Verification Express Application

This is a simple Express.js application for sending and verifying OTPs (One-Time Passwords) via email. It uses the CryptoJS library for OTP encryption and otp-generator to generate OTPs.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- A valid Gmail account and app password (if you're using Gmail for sending emails).
- expressjs, mocha, chai, crypto-js, cryptojs, nodemon.

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your-username/otp-verification-express.git

   
## Use of the API

1. For sending OTP to a email:
   ```bash
    http://localhost:8000/send-otp

2.For Verifying the OTP to the email:
    
     http://localhost:8000/verify-otp   

3. You can change the port no. according to your preference.

## Cryptography

1.  For Securing the OTP , the otp is encrypted and decrypted with the help of CryptoJS.

## Testing 

1. For unit-testing this API is using Mocha-Chai. For checking first write some Test Cases.
2. Then use the command npm test to run the test-cases. Some dummy test cases are written.



   
