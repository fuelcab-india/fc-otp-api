// const request = require('supertest');
// const {ObjectID} = require('mongodb');
// const{registerUser,verifyOtp,loginUser,profile}=require('../src/handlers/userAuth');  Here we have to make a sample database for testing or we can use api's of the company to complete the testing 
// const {app} = require('./../server');
const {User} = require('./../src/Model/userModel');
const {Otp} = require('./../src/Model/otpModel');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, before, after } = require('mocha');
require("dotenv").config();


chai.use(chaiHttp);
const expect = chai.expect;

//Mocha code for userModel

describe('User Model', () => {
  // Test cases for userSchema.methods.generateJWT()
  describe('#generateJWT()', () => {
    it('should generate a valid JWT token', () => {
      const user = new User({ email: 'test@example.com' });
      const token = user.generateJWT();
      expect(token).to.be.a('string');
    });

    it('should contain the user ID and email in the JWT payload', () => {
      const user = new User({ email: 'test@example.com' });
      const token = user.generateJWT();
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      expect(decoded).to.have.property('_id', user._id.toString());
      expect(decoded).to.have.property('email', user.email);
    });

    it('should set the token expiration to 7 days', () => {
      const user = new User({ email: 'test@example.com' });
      const token = user.generateJWT();
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const expiration = new Date(decoded.exp * 1000); // Convert seconds to milliseconds
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
      expect(expiration).to.be.at.most(sevenDaysFromNow);
    });
  });
});

//Mocha code for otpModel

describe('Otp Model', () => {
  before(async () => {
    // Connect to the MongoDB database before running the tests
    await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  after(async () => {
    // Close the MongoDB connection after running the tests
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the 'Otp' collection before each test
    await Otp.deleteMany({});
  });

  // Test cases for the 'Otp' model
  describe('#create()', () => {
    it('should create a new OTP document', async () => {
      const otpData = {
        email: 'test@example.com',
        otp: '123456',
      };

      const otp = new Otp(otpData);
      const savedOtp = await otp.save();

      expect(savedOtp).to.have.property('_id');
      expect(savedOtp.email).to.equal(otpData.email);
      expect(savedOtp.otp).to.equal(otpData.otp);
    });

    it('should set a default expiration of 300 seconds (5 minutes)', async () => {
      const otpData = {
        email: 'test@example.com',
        otp: '123456',
      };

      const otp = new Otp(otpData);
      const savedOtp = await otp.save();

      const expiresIn = (savedOtp.createdAt.getTime() + 300 * 1000) - new Date().getTime();
      expect(expiresIn).to.be.closeTo(0, 1000); // Close to 0 within a second
    });

    it('should require the "email" field', async () => {
      const otpData = {
        otp: '123456',
      };

      const otp = new Otp(otpData);

      try {
        await otp.save();
      } catch (error) {
        expect(error.errors.email).to.exist;
      }
    });

    it('should require the "otp" field', async () => {
      const otpData = {
        email: 'test@example.com',
      };

      const otp = new Otp(otpData);

      try {
        await otp.save();
      } catch (error) {
        expect(error.errors.otp).to.exist;
      }
    });
  });
});

// Mocha Code for userAuth

describe('User Registration API', () => {
  before(async () => {
    // Connect to the MongoDB database or set up your database for testing
    // Also, start your Express app or set up a testing environment
  });

  after(async () => {
    // Close the MongoDB connection and stop the Express app after running the tests
  });

  beforeEach(async () => {
    // Clear the 'User' and 'Otp' collections or set up test data before each test
    await User.deleteMany({});
    await Otp.deleteMany({});
  });

  describe('POST /registerUser', () => {
    it('should register a new user and send an OTP email', async () => {
      // Create a mock request object with the required data
      const req = {
        body: {
          email: 'test@example.com',
        },
      };

      // Send a POST request to your API route '/registerUser' using chai-http
      const res = await chai.request(app).post('/registerUser').send(req);

      // Assert the response status code and message
      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('OTP sent successfully.');

      // Assert that the user and OTP data were created in the database
      const user = await User.findOne({ email: 'test@example.com' });
      const otp = await Otp.findOne({ email: 'test@example.com' });

      expect(user).to.exist;
      expect(otp).to.exist;
    });

    // Add more test cases for error handling and validation as needed
  });

  // Add more test cases for other API routes such as '/verifyOtp', '/loginUser', etc.
});
