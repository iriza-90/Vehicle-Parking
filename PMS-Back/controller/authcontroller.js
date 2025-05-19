const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const sendEmail = require('../utils/sendEmail');

// Generate 6-digit code
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000);

// Signup
exports.signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const verificationCode = generateVerificationCode();

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      verificationCode,
      isVerified: false
    });

    const emailContent = `
      <p>Hey ${firstname},</p>
      <p>Your verification code is:</p>
      <h2 style="color: #4F46E5;">${verificationCode}</h2>
      <p>Do not share this code with anyone.</p>
    `;
    await sendEmail(email, 'Verify Your Email', emailContent);

    res.status(201).json({ message: 'User created. Check email for verification code.', email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isVerified) return res.status(400).json({ error: 'Already verified' });

    if (String(user.verificationCode).trim() !== String(code).trim()) {
      return res.status(400).json({ error: 'Invalid code' });
    }

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    res.json({ message: 'Email verified successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const validPass = bcrypt.compareSync(req.body.password, user.password);
    if (!validPass) return res.status(401).json({ error: 'Invalid password' });

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Email not verified' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '40m' }
    );

    res.json({ token,user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};



