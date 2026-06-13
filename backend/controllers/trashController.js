const Bill = require('../models/Bill');
const Item = require('../models/Item');
const Party = require('../models/Party');
const Counter = require('../models/Counter');

// Get all soft-deleted records for a specific type
exports.getTrash = async (req, res) => {
  try {
    const { type } = req.params;
    let records = [];
    const query = { deletedAt: { $ne: null }, userId: req.user._id };
    if (type === 'bills') {
      records = await Bill.find(query).sort({ deletedAt: -1 });
    } else if (type === 'items') {
      records = await Item.find(query).sort({ deletedAt: -1 });
    } else if (type === 'parties') {
      records = await Party.find(query).sort({ deletedAt: -1 });
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Restore a soft-deleted record
exports.restoreTrash = async (req, res) => {
  try {
    const { type, id } = req.params;
    let record = null;
    const query = { _id: id, userId: req.user._id };
    if (type === 'bills') {
      record = await Bill.findOneAndUpdate(query, { deletedAt: null }, { new: true });
    } else if (type === 'items') {
      record = await Item.findOneAndUpdate(query, { deletedAt: null }, { new: true });
    } else if (type === 'parties') {
      record = await Party.findOneAndUpdate(query, { deletedAt: null }, { new: true });
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }

    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Record restored successfully', record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Permanently delete a record
exports.permanentDelete = async (req, res) => {
  try {
    const { type, id } = req.params;
    const query = { _id: id, userId: req.user._id };
    if (type === 'bills') {
      const bill = await Bill.findOneAndDelete(query);
      if (!bill) return res.status(404).json({ error: 'Bill not found' });

      await Counter.addReusableNumber('billNumber', req.user._id, bill.billNumber);
    } else if (type === 'items') {
      const item = await Item.findOneAndDelete(query);
      if (!item) return res.status(404).json({ error: 'Item not found' });
    } else if (type === 'parties') {
      const party = await Party.findOneAndDelete(query);
      if (!party) return res.status(404).json({ error: 'Party not found' });
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }

    res.json({ message: 'Record permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
