const Item = require('../models/Item');

exports.getItems = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { deletedAt: null };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    const items = await Item.find(query).sort({ name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { name, defaultPrice, unit } = req.body;
    if (!name) return res.status(400).json({ error: 'Item name is required' });
    const existing = await Item.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (existing) return res.status(400).json({ error: 'Item with this name already exists' });
    const item = new Item({ name, defaultPrice: defaultPrice || 0, unit: unit || 'pcs' });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { name, defaultPrice, unit } = req.body;
    if (!name) return res.status(400).json({ error: 'Item name is required' });
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { name, defaultPrice: defaultPrice || 0, unit: unit || 'pcs' },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, { deletedAt: new Date() }, { new: true });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item moved to trash successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
