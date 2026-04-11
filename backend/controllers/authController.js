const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
 
// ─── Helpers ─────────────────────────────────────────────────────────────────
 
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
 
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
};
 
// ─── Controllers ─────────────────────────────────────────────────────────────
 
/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = async (req, res) => {
  const { name, email, password } = req.body;
 
  // Basic field validation
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
  }
 
  // Check if email is already taken
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
  }
 
  // Create user (password hashed by pre-save hook)
  const user = await User.create({ name, email, password });
 
  sendTokenResponse(user, 201, res);
};
 
/**
 * @desc    Login existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  const { email, password } = req.body;
 
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password.' });
  }
 
  // Fetch user with password field (excluded by default)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }
 
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }
 
  sendTokenResponse(user, 200, res);
};
 
/**
 * @desc    Get currently authenticated user
 * @route   GET /api/auth/me
 * @access  Private (requires JWT)
 */
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
    },
  });
};
 
module.exports = { signup, login, getMe };
 