const Party = require('../models/Party');

exports.getParties = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { deletedAt: null };
    if (search) {
      query.companyName = { $regex: search, $options: 'i' };
    }
    const parties = await Party.find(query).sort({ companyName: 1 });
    res.json(parties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPartyById = async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);
    if (!party) return res.status(404).json({ error: 'Party not found' });
    res.json(party);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createParty = async (req, res) => {
  try {
    const { companyName, gstNumber, address, phone } = req.body;
    if (!companyName) return res.status(400).json({ error: 'Company name is required' });
    const party = new Party({ companyName, gstNumber, address, phone });
    await party.save();
    res.status(201).json(party);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateParty = async (req, res) => {
  try {
    const { companyName, gstNumber, address, phone } = req.body;
    if (!companyName) return res.status(400).json({ error: 'Company name is required' });
    const party = await Party.findByIdAndUpdate(
      req.params.id,
      { companyName, gstNumber, address, phone },
      { new: true, runValidators: true }
    );
    if (!party) return res.status(404).json({ error: 'Party not found' });
    res.json(party);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteParty = async (req, res) => {
  try {
    const party = await Party.findByIdAndUpdate(req.params.id, { deletedAt: new Date() }, { new: true });
    if (!party) return res.status(404).json({ error: 'Party not found' });
    res.json({ message: 'Party moved to trash successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
