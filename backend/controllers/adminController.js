const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Bill = require('../models/Bill');
const Item = require('../models/Item');
const Party = require('../models/Party');
const Profile = require('../models/Profile');
const Counter = require('../models/Counter');

// Admin credentials as requested
const ADMIN_USER = 'Guru';
const ADMIN_PASS = '02041977';

const generateAdminToken = () => {
  return jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '5m', // Extra security: Enforce 5 minute absolute expiration on the backend
  });
};

exports.adminLogin = (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ token: generateAdminToken() });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    // For each user, we can optionally fetch counts, but to keep it simple and performant,
    // we'll just return the user objects which now contain lastLogin.
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Delete user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await User.findByIdAndDelete(userId);

    // Delete isolated data
    await Bill.deleteMany({ userId });
    await Item.deleteMany({ userId });
    await Party.deleteMany({ userId });
    await Profile.deleteMany({ userId });
    await Counter.deleteMany({ userId });

    res.json({ message: 'User and all associated data deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const profile = await Profile.findOne({ userId });
    
    // Get counts
    const billsCount = await Bill.countDocuments({ userId });
    const itemsCount = await Item.countDocuments({ userId });
    const partiesCount = await Party.countDocuments({ userId });

    // Get recent 5 bills
    const recentBills = await Bill.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('billNumber party billDate grandTotal');

    res.json({
      user,
      profile,
      stats: {
        bills: billsCount,
        items: itemsCount,
        parties: partiesCount
      },
      recentBills
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
