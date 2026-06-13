const express = require('express');
const router = express.Router();
const { adminLogin, getUsers, deleteUser, getUserData, getTrashedUsers, restoreUser, permanentDeleteUser } = require('../controllers/adminController');
const { adminProtect } = require('../middleware/adminMiddleware');
const { register } = require('../controllers/authController');

router.post('/login', adminLogin);
router.get('/users', adminProtect, getUsers);
router.get('/users/trash', adminProtect, getTrashedUsers);
router.post('/users', adminProtect, register);
router.delete('/users/:id', adminProtect, deleteUser);
router.post('/users/:id/restore', adminProtect, restoreUser);
router.delete('/users/:id/permanent', adminProtect, permanentDeleteUser);
router.get('/users/:id/data', adminProtect, getUserData);

module.exports = router;
