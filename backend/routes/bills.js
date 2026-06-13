const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.get('/', billController.getBills);
router.get('/next-number', billController.getNextNumber);
router.get('/summary', billController.getSummary);
router.get('/:id', billController.getBillById);
router.post('/', billController.createBill);
router.delete('/:id', billController.deleteBill);

module.exports = router;
