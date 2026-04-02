const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const Counter = require('../models/Counter');

router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, partyId } = req.query;
    let query = {};
    if (startDate || endDate) {
      query.billDate = {};
      if (startDate) query.billDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.billDate.$lte = end;
      }
    }
    if (partyId) query['party.id'] = partyId;
    const bills = await Bill.find(query).sort({ billNumber: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/next-number', async (req, res) => {
  try {
    const counter = await Counter.findById('billNumber');
    let nextNumber = 1;
    if (counter) {
      if (counter.reusable && counter.reusable.length > 0) {
        nextNumber = Math.min(...counter.reusable);
      } else {
        nextNumber = counter.seq + 1;
      }
    }
    res.json({ nextNumber });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { billDate, party, items, subtotal, gstPercent, gstAmount, grandTotal, notes } = req.body;
    if (!party || !items || items.length === 0) {
      return res.status(400).json({ error: 'Party and items are required' });
    }
    const billNumber = await Counter.getNextSequence('billNumber');
    const bill = new Bill({
      billNumber,
      billDate: billDate || new Date(),
      party,
      items,
      subtotal,
      gstPercent: gstPercent || 0,
      gstAmount: gstAmount || 0,
      grandTotal,
      notes,
    });
    await bill.save();
    res.status(201).json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
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

    res.json({ message: 'Bill deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
