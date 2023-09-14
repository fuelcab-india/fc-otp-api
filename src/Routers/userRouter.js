const router = require('express').Router();
const { registerUser, verifyOtp, generateOTP, loginUser , profile} = require('../handlers/userAuth');

router.route('/register')
    .post(registerUser);

router.route('/otp/verify')
    .post(verifyOtp);

router.route('/login')
    .post(loginUser);

router.route('/profile')
    .post(profile);

 router.route('/otp/generate')
    .post(generateOTP);

//Unauthorized Url Handler
router.all("*", (Request, Response) => {
    Response.status(404).json({
      status: "fail",
      message: `Route: ${Request.originalUrl} does not exist on this server`,
    });
  });

module.exports = router;


/* 
register
login
getotp
validate otp
resend otp */