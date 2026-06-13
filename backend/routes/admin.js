const express = require('express');
const router = express.Router();
const { adminLogin, getUsers, deleteUser } = require('../controllers/adminController');
const { adminProtect } = require('../middleware/adminMiddleware');
const { register } = require('../controllers/authController');

router.post('/login', adminLogin);
router.get('/users', adminProtect, getUsers);
router.post('/users', adminProtect, register); // Admin can use the same register logic to create users
router.delete('/users/:id', adminProtect, deleteUser);

module.exports = router;
