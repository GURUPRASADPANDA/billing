const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const Item = require('../models/Item');
const Party = require('../models/Party');
const Counter = require('../models/Counter');

// Get all soft-deleted records for a specific type
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    let records = [];
    if (type === 'bills') {
      records = await Bill.find({ deletedAt: { $ne: null } }).sort({ deletedAt: -1 });
    } else if (type === 'items') {
      records = await Item.find({ deletedAt: { $ne: null } }).sort({ deletedAt: -1 });
    } else if (type === 'parties') {
      records = await Party.find({ deletedAt: { $ne: null } }).sort({ deletedAt: -1 });
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Restore a soft-deleted record
router.post('/restore/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    let record = null;
    if (type === 'bills') {
      record = await Bill.findByIdAndUpdate(id, { deletedAt: null }, { new: true });
    } else if (type === 'items') {
      record = await Item.findByIdAndUpdate(id, { deletedAt: null }, { new: true });
    } else if (type === 'parties') {
      record = await Party.findByIdAndUpdate(id, { deletedAt: null }, { new: true });
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }

    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Record restored successfully', record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Permanently delete a record
router.delete('/permanent/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    if (type === 'bills') {
      const bill = await Bill.findByIdAndDelete(id);
      if (!bill) return res.status(404).json({ error: 'Bill not found' });

      const counter = await Counter.findById('billNumber');
      if (counter) {
        if (counter.seq === bill.billNumber) {
          counter.seq -= 1;
        } else {
          if (!counter.reusable) counter.reusable = [];
          if (!counter.reusable.includes(bill.billNumber)) {
            counter.reusable.push(bill.billNumber);
          }
        }
        await counter.save();
      }
    } else if (type === 'items') {
      const item = await Item.findByIdAndDelete(id);
      if (!item) return res.status(404).json({ error: 'Item not found' });
    } else if (type === 'parties') {
      const party = await Party.findByIdAndDelete(id);
      if (!party) return res.status(404).json({ error: 'Party not found' });
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }

    res.json({ message: 'Record permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
