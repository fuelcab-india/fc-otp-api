const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, before, after } = require('mocha');
const app = require('../server'); 
const { users } = require('../src/Models/otpModel');

chai.use(chaiHttp);
const expect = chai.expect;

describe('OTP Verification API', () => {
  before(() => {
    // Start your Express app or set up a testing environment
    // You can perform any necessary setup here.
  });

  after(() => {
    // Stop your Express app or clean up the testing environment
    // You can perform any necessary teardown here.
  });

  describe('POST /send-otp', () => {
    it('Should send OTP to a user\'s phoneNo', async function(){
      this.timeout(5000);
      const res = await chai
        .request(app)
        .post('/api/otp/generate')
        .send({ phoneNo: '9911991100' }); 
  
      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('OTP sent successfully');
    });
  
  

    it('should return "Wrong Method Called" for again pressing ', async () => {
      const res = await chai
        .request(app)
        .post('/api/otp/generate')
        .send({  phoneNo: '9911991100' });

      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('Wrong Method Called');
    });
  });

  describe('POST /api/otp/verify', () => {
    it('should find a invalid OTP', async () => {
      const phoneNo= '9911991100'; // Replace with a valid Phone No.
      const otp = '123456'; // Replace with a valid OTP

      const res = await chai
        .request(app)
        .post('/api/otp/verify')
        .send({ phoneNo, otp });

      expect(res).to.have.status(400);
      expect(res.body.error).to.equal('Invalid OTP');
    });
  });
});