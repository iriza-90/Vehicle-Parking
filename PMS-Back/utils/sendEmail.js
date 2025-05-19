const nodemailer = require('nodemailer');

// Create a transporter using your email provider 
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS   
  }
});

// Function to send an email
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender's email
    to,                           // Recipient's email
    subject,                      // Subject of the email
    html,                         // HTML content of the email
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
