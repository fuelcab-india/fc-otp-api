const router = require('express').Router();
const { verifyOtp, sendOtp} = require('../Handler/otpAuth');

router.route('/otp/generate')
    .post(sendOtp);

router.route('/otp/verify')
    .post(verifyOtp);  

//Unauthorized Url Handler
router.all("*", (req, res) => {
    res.status(404).json({
      status: "fail",
      message: `Route: ${req.originalUrl} does not exist on this server`,
    });
  });

module.exports = router;