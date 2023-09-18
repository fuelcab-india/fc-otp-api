const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, before, after } = require('mocha');
const app = require('./server'); 
const { users } = require('./seed');

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
    it('should send OTP to a user\'s email', async () => {
      const res = await chai
        .request(app)
        .post('/send-otp')
        .send({ email: 'kapoorshivam77@gmail.com' }); // Replace with a valid email

      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('OTP sent successfully');
    });

    it('should return "Already otp send" for an existing user', async () => {
      const res = await chai
        .request(app)
        .post('/send-otp')
        .send({ email: 'kapoorshivam77@gmail.com' }); // Replace with an existing email

      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('Already otp send');
    });
  });

  describe('POST /verify-otp', () => {
    it('should verify a valid OTP', async () => {
      const email = 'kapoorshivam77@gmail.com'; // Replace with a valid email
      const otp = req.body.otp; // Replace with a valid OTP

      const res = await chai
        .request(app)
        .post('/verify-otp')
        .send({ email, otp });

      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('OTP verified successfully');
    });

    it('should return "Invalid OTP" for an invalid OTP', async () => {
      const email = 'kapoorshivam77@gmail.com'; // Replace with a valid email
      const otp = req.body.otp; // Replace with an invalid OTP

      const res = await chai
        .request(app)
        .post('/verify-otp')
        .send({ email, otp });

      expect(res).to.have.status(400);
      expect(res.body.error).to.equal('Invalid OTP');
    });

    it('should return an error for missing email', async () => {
      const res = await chai
        .request(app)
        .post('/verify-otp')
        .send({ otp: '123456' }); // Provide an OTP and a valid email

      expect(res).to.have.status(400);
      expect(res.body.error).to.equal('Enter email');
    });

    it('should return an error for missing OTP', async () => {
      const res = await chai
        .request(app)
        .post('/verify-otp')
        .send({ email: 'kapoorshivam77@gmail.com' }); // Provide an email

      expect(res).to.have.status(400);
      expect(res.body.error).to.equal('Enter OTP');
    });

    it('should return an error for an invalid OTP format', async () => {
      const email = 'kapoorshivam77@gmail.com'; // Replace with a valid email
      const otp = users[email]; // Replace with a valid OTP

      const res = await chai
        .request(app)
        .post('/verify-otp')
        .send({ email, otp: 'invalid-otp' }); // Provide an invalid OTP format

      expect(res).to.have.status(400);
      expect(res.body.error).to.equal('Invalid OTP format');
    });

    it('should return an error for an expired OTP', async () => {
      const email = 'kapoorshivam77@gmail.com'; // Replace with a valid email
      users[email] = 'expired-otp'; // Replace with an expired OTP

      const res = await chai
        .request(app)
        .post('/verify-otp')
        .send({ email, otp: 'expired-otp' }); // Provide the expired OTP

      expect(res).to.have.status(400);
      expect(res.body.error).to.equal('Expired OTP');
    });
  });
});