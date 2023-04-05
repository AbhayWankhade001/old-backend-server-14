import express from "express";
import {Employee , Admin} from "../model/User.model.js";
import nodemailer from "nodemailer"

import config from "./config.js";
import jwt from 'jsonwebtoken';
import { BankDetails } from "../model/User.model.js";

import bcrypt from "bcrypt"
import cryptoRandomString from "crypto-random-string";
import AWS from "aws-sdk";
import multer from 'multer';
const router2 = express.Router();


//>>>>>>>>>>>>>>>>>>>>>>>>>>POST API are here  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<//

// router2.post("/addBankDetails", async (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
//   if (!token) {
//     return res.status(401).send('Unauthorized');
//   }

//   try {
//     const token = req.headers.authorization.split(' ')[1];
//     const decodedToken = jwt.verify(token, config.JWT_SECRET,  { algorithm: 'HS256' });
//     const employeeId = decodedToken.employeeId;
//     const adminId = decodedToken.adminId;    
//     console.log(decodedToken);
//     console.log(employeeId);
//     console.log(adminId);

//     // Find the existing bank details object for the employee
//     let bankDetails = await BankDetails.findOne({ employeeId: employeeId });
//     console.log(employeeId)
//     if (bankDetails) {
//       // Update the existing bank details object with the new form data
//       bankDetails.accountholdername = req.body.accountholdername;
//       bankDetails.mobilenumber = req.body.mobilenumber;
//       bankDetails.acctype = req.body.acctype;
//       bankDetails.bankname = req.body.bankname;
//       bankDetails.branchname = req.body.branchname;
//       bankDetails.ifsc = req.body.ifsc;
//       bankDetails.pannumber = req.body.pannumber;
//       bankDetails.bankaccnumber = req.body.bankaccnumber;
//     } else {
//       // Create a new bank details object and populate it with form data
//       bankDetails = new BankDetails({
//         employeeId: employeeId,
//         adminId: adminId,
//         accountholdername: req.body.accountholdername,
//         mobilenumber: req.body.mobilenumber,
//         acctype: req.body.acctype,
//         bankname: req.body.bankname,
//         branchname: req.body.branchname,
//         ifsc: req.body.ifsc,
//         pannumber: req.body.pannumber,
//         bankaccnumber:req.body.bankaccnumber,
//       });
//     }

//     // Save the bank details object to the database
//     const savedBankDetails = await bankDetails.save();
//     console.log("Bank details added/updated successfully. Employee ID:", employeeId, "Admin ID:", adminId, "Form data:", savedBankDetails);
//     res.send(savedBankDetails);
//   } catch (err) {
//     console.log("Error adding/updating bank details:", err.message);
//     console.log('Error decoding JWT token:', err.message);
//     return res.status(401).send('Unauthorized');
//   }
// });
router2.post('/addBankDetails', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const decodedToken = jwt.verify(token, config.JWT_SECRET, { algorithm: 'HS256' });
    const employeeId = decodedToken.employeeId;
    const adminId = decodedToken.adminId;    
    console.log(decodedToken);
    console.log(employeeId);
    console.log(adminId);

    // Find the existing bank details object for the employee
    let bankDetails = await BankDetails.findOne({ employeeId: employeeId });
    console.log(employeeId)
    if (bankDetails) {
      // Update the existing bank details object with the new form data
      bankDetails.accountholdername = req.body.accountholdername;
      bankDetails.mobilenumber = req.body.mobilenumber;
      bankDetails.acctype = req.body.acctype;
      bankDetails.bankname = req.body.bankname;
      bankDetails.branchname = req.body.branchname;
      bankDetails.ifsc = req.body.ifsc;
      bankDetails.pannumber = req.body.pannumber;
      bankDetails.bankaccnumber = req.body.bankaccnumber;
    } else {
      // Create a new bank details object and populate it with form data
      bankDetails = new BankDetails({
        employeeId: employeeId,
        adminId: adminId,
        accountholdername: req.body.accountholdername,
        mobilenumber: req.body.mobilenumber,
        acctype: req.body.acctype,
        bankname: req.body.bankname,
        branchname: req.body.branchname,
        ifsc: req.body.ifsc,
        pannumber: req.body.pannumber,
        bankaccnumber:req.body.bankaccnumber,
      });
    }

    // Save the bank details object to the database
    const savedBankDetails = await bankDetails.save();
    console.log("Bank details added/updated successfully. Employee ID:", employeeId, "Admin ID:", adminId, "Form data:", savedBankDetails);
    res.send(savedBankDetails);
  } catch (err) {
    console.log("Error adding/updating bank details:", err.message);
    console.log('Error decoding JWT token:', err.message);
    return res.status(401).send('Unauthorized');
  }
});
//>>>>>>>>>>>>>>>>>>>>>>>>>>GET API are here  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<//


router2.get("/bankDetails", async (req, res) => {
  // Get the JWT token from the request headers or cookies
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  try {
    // Verify the JWT token and extract the employee ID
    const decodedToken = jwt.verify(token, config.JWT_SECRET,  { algorithm: 'HS256' });
    const employeeId = decodedToken.employeeId;

    // Find the bank details for the employee with the matching ID
    const bankDetails = await BankDetails.findOne({ employeeId });
    if (!bankDetails) {
      console.log("Bank details not found for employee ID:", employeeId);
      return res.status(404).json({ error: "Bank details not found" });
    }

    // Return the bank details as a response
    console.log("Bank details retrieved successfully for employee ID:", employeeId);
    res.send(bankDetails);
  } catch (err) {
    console.log("Error retrieving bank details:", err.message);
    console.log('Error decoding JWT token:', err.message);
    return res.status(401).send('Unauthorized');
  }
});




router2.get("/bankDetailsadmin", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const decodedToken = jwt.verify(token, config.JWT_SECRET,  { algorithm: 'HS256' });
    console.log("Decoded token:", decodedToken); // Debugging purposes only
    const adminId = decodedToken.adminId;
  
    // Check if the admin with the given ID exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      console.log("Admin not found with ID:", adminId);
      return res.status(404).json({ error: "Admin not found" });
    }

    // Retrieve bank details of all employees
    const bankDetails = await BankDetails.find();

    // Return the bank details as a response
    console.log("Bank details retrieved successfully");
    res.send(bankDetails);
  } catch (err) {
    console.log("Error retrieving bank details:", err.message);
    console.log('Error decoding JWT token:', err.message);
    return res.status(401).send('Unauthorized');
  }
});













//>>>>>>>>>>>>>>>>>>>>>>>>>>PUT API are here  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<//




const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'surendrawankhade1973@gmail.com',
    pass: 'cyjepyhwchonjuii',
  }
});




function checkRequiredFields(obj, fields) {
  return fields.every(field => Object.prototype.hasOwnProperty.call(obj, field) && obj[field])
    && obj.newPassword === obj.confirmNewPassword;
}


// function checkRequiredFields(obj, fields) {
//   return fields.every(field => Object.prototype.hasOwnProperty.call(obj, field) && obj[field]);
// }

router2.put('/createEmployees', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    const { newPassword, confirmNewPassword, email } = req.body;
    let employee;

    if (token) {
      // if token is present
      const tokenData = jwt.verify(token, config.JWT_SECRET,  { algorithm: 'HS256' });
      const adminId = tokenData.adminId;
      const employeeId = tokenData.employeeId;
      const email = tokenData.email;

      console.log('Admin ID:', adminId);
      console.log('Employee ID:', employeeId);
      console.log('Started resetting employee password');
      console.log('authorizationHeader:', token);
      console.log('token:', token);
      console.log('tokenData:', tokenData);
      console.log('adminId:', adminId);
      console.log('employeeId:', employeeId);

      employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }
    } else if (email) {
      // if token is not present, but email is provided
      employee = await Employee.findOne({ email });
      if (!employee) {
        throw new Error('No account found with the provided email');
      }
    } else {
      throw new Error('Authorization header or email is missing');
    }

    if (!checkRequiredFields(req.body, ['newPassword', 'confirmNewPassword'])) {
      throw new Error('newPassword and confirmNewPassword are required');
    }
    if (newPassword !== confirmNewPassword) {
      throw new Error('newPassword and confirmNewPassword do not match');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    employee.password = passwordHash;
    await employee.save();
    console.log('Employee password reset successful');

    // Send notification to employee's email using NodeMailer
    const mailOptions = {
      from: "surendrawankhade1973@gmail.com",
      to: employee.email,
      subject: 'Your password has been reset for Cling Multi Solution',
      html: `<p>Hello ${employee.firstName},</p>
             <p>Your password has been successfully reset for your Cling Multi Solution account.</p>
             <p>Please login to your account with your new password and reset it again

               <p>Thank you!</p>`
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error:', error.message);
        } else {
          console.log('Email sent:', info.response);
        }
      });
  
      res.send({ message: 'Employee password reset successful' });
  
    } catch (err) {
      console.log('Error:', err.message);
      res.status(400).send({ message: err.message });
    }
  });
  
  
  
  
  
let otpInfo = { email: '', otp: '' };

// Route to send OTP to user's email
router2.post('/forgotPassword/sendOTP', async (req, res) => {
  try {
    const { email } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee) {
      throw new Error('No account found with the provided email');
    }

    // Check if there is already an OTP in the employee's document
    if (employee.otp) {
      employee.otpExpiry = new Date(Date.now() - 1); // Set the OTP's expiry time to a time in the past
      await employee.save();
    }

    // Generate OTP
    const otp = cryptoRandomString({ length: 6 });
    console.log(otp);

    // Save OTP and its expiry time in employee's document
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP will expire after 10 minutes
    employee.otp = otp;
    employee.otpExpiry = otpExpiry;
    await employee.save();

    // Save email and OTP for verification
    otpInfo.email = email;
    otpInfo.otp = otp;

    // Send OTP to employee's email using NodeMailer
    const mailOptions = {
      from: config.EMAIL_ADDRESS,
      to: email,
      subject: 'Reset your password for Cling Multi Solution',
      html: `<p>Hello ${employee.firstName},</p>
             <p>Your OTP for resetting your Cling Multi Solution account password is:</p>
             <p style="font-size: 24px; font-weight: bold;">${otp}</p>
             <p>Please use this OTP to reset your password within 10 minutes of receiving this email.</p>
             <p>Thank you!</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error:', error.message);
        throw new Error('Could not send OTP to the provided email');
      } else {
        console.log('Email sent:', info.response);
        res.send({ message: 'OTP sent successfully' });
      }
    });
  } catch (err) {
    console.log('Error:', err.message);
    res.status(400).send({ message: err.message });
  }
});

// Route to verify OTP
router2.post('/forgotPassword/verifyOTP', async (req, res) => {
  try {
    const { otp } = req.body;

    // Verify OTP
    if (otp !== otpInfo.otp || new Date() > otpInfo.otpExpiry) {
      throw new Error('Invalid or expired OTP');
    }

    // Retrieve employee with the provided email
    const employee = await Employee.findOne({ email: otpInfo.email });
    if (!employee) {
      throw new Error('No account found with the provided email');
    }

    // Save credentials in a variable
    const credentials = { email: otpInfo.email, otp };

    res.send({ message: 'OTP verification successful', credentials });
  } catch (err) {
    console.log('Error:', err.message);
    res.status(400).send({ message: err.message });
  }
});




router2.put('/forgotPassword/updatePassword', async (req, res) => {
  try {
    const { newPassword } = req.body; // add this line
    const { email } = otpInfo;
    const employee = await Employee.findOne({ email });
    
    if (!employee) {
      throw new Error('No account found with the provided email');
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    employee.password = hashedPassword;
    await employee.save();

    // Remove OTP and its expiry time from employee's document
    employee.otp = '';
    employee.otpExpiry = '';
    await employee.save();

    // Clear resetCredentials
    otpInfo = { email: '', otp: '' };

    console.log('Password updated successfully'); // Debugging purposes only

    res.send({ message: 'Password updated successfully' });
  } catch (err) {
    console.log('Error:', err.message);
    res.status(400).send({ message: err.message });
  }
});






// Set up AWS S3 configuration
AWS.config.update({
  bucketName: "clinginvoice",
        region: "ap-southeast-2",
        accessKeyId: 'AKIA3ACAYLO7SQIXYFPJ',
        secretAccessKey: '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',
});

// Create an S3 instance
const s3 = new AWS.S3();

// Set up Multer middleware to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });









// Define a function to fetch a PDF file from S3 and send it as an email attachment
async function sendPdfByEmail(pdfKey, recipientEmail, message) {
  try {
    // Fetch the PDF file from S3
    const s3Params = {
      Bucket: 'clinginvoice',
      Key: pdfKey,
    };
    const pdfObject = await s3.getObject(s3Params).promise();

    // Set up the email options
    const mailOptions = {
      from: 'abhaywankhade2004@gmil.com',
      to: recipientEmail,
      subject: 'PDF attachment',
      text: message,
      attachments: [
        {
          filename: pdfKey,
          content: pdfObject.Body,
        },
      ],
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error(error);
  }
}

// Define the API endpoint
router2.post('/send-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const pdfKey = req.body.pdfName;
    const recipientEmail = req.body.email;
    const message = req.body.message;
    await sendPdfByEmail(pdfKey, recipientEmail, message);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending email');
  }
});

  
export default router2;
