# fc-otp-api

# fc-otp-api

**fc-otp-api** is a RESTful API for handling One-Time Password (OTP) generation and validation. It is designed to provide easy integration with applications that require OTP functionality, such as authentication systems, two-factor authentication (2FA), and more.

## Table of Contents

- [Files](#files)
  - [server.js](#serverjs)
  - [Functions in otpAuth.js](#functions-in-otpauthjs)
  - [otpModel.js](#otpmodeljs)
- [Routes in otpRouter.js](#routes-in-optrouterjs)
- [Unit Testing in otpTest.js](#unit-testing-in-opttestjs)
- [Environment Variables](#environment-variables)
- [Usage](#usage)

## Files

### `server.js`

This file sets up the Express.js server and handles the server's initialization. It includes the following components:

- Import necessary libraries and modules.
- Set up Express.js with middleware for JSON and URL-encoded data.
- Define API routes using the `/api` prefix.
- Connect to the MongoDB database using Mongoose.
- Start the Express.js server on the specified port.

### Functions in `otpAuth.js`

#### `sendOtp`

- **Purpose**: This function generates and sends an OTP to a user's phone number.
- **Usage**: Send an HTTP POST request to `/api/otp/generate` with the `phoneNo` parameter.
- **Behavior**:
  - Checks if an OTP has already been sent to the same phone number within the last 60 seconds and prevents resending.
  - Generates a new OTP, stores it in memory, and encrypts it before saving it to the database.
  - Returns a success message and the result object.

#### `verifyOtp`

- **Purpose**: This function verifies an OTP provided by the user.
- **Usage**: Send an HTTP POST request to `/api/otp/verify` with the `phoneNo` and `otp` parameters.
- **Behavior**:
  - Fetches the encrypted OTP associated with the provided phone number from the database.
  - Decrypts the stored OTP and compares it to the user-provided OTP.
  - Returns a success message if the OTPs match; otherwise, returns an error message.

#### `resendOtp`

- **Purpose**: This function allows the user to request OTP resend if the OTP is expired or not received.
- **Usage**: Send an HTTP POST request to `/api/otp/resend` with the `phoneNo` parameter.
- **Behavior**:
  - Checks if the OTP for the provided phone number is expired or not sent within the last 60 seconds.
  - Generates a new OTP, stores it in memory, updates the database, and schedules its removal after 60 seconds.
  - Returns a success message and the result object.

### `otpModel.js`

This file defines the Mongoose schema for storing OTPs in the MongoDB database. It includes the following fields:

- `phoneNo`: The phone number associated with the OTP (String).
- `otp`: The encrypted OTP (String).
- `createdAt`: The timestamp when the OTP document was created, with a TTL (time-to-live) index to automatically expire documents after 5 minutes.

## Routes in `otpRouter.js`

This file defines the Express.js router for handling OTP-related API endpoints. It includes the following routes:

- `POST /api/otp/generate`: Generates and sends an OTP to a user's phone number.
- `POST /api/otp/verify`: Verifies an OTP provided by the user.
- `POST /api/otp/resend`: Allows the user to request OTP resend.

Additionally, there is a catch-all route that returns a 404 error for unrecognized routes.

## Unit Testing in `otpTest.js`

This file contains unit tests for the OTP generation and verification functionalities using the Mocha and Chai testing framework. It includes test cases for:

- Sending an OTP.
- Handling attempts to send an OTP multiple times.
- Verifying a valid OTP.
- Verifying an invalid OTP.

## Environment Variables

- The project uses environment variables defined in a `.env` file to configure MongoDB connection details. Make sure to create a `.env` file with the appropriate values.

## Usage

To use this API, follow the API endpoints defined in the `otpRouter.js` file and the associated functions in `otpAuth.js`. You can send HTTP requests to the specified routes to generate, verify, and resend OTPs.

Please note that this documentation provides a high-level overview of the project's structure and functionality. For detailed information, refer to the code and comments within each file.

For any further assistance or questions, feel free to contact the project maintainers.
