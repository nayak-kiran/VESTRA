const Wardrobe = require('c:/VESTRA/backend/models/wardrobe.js');

exports.addToWardrobe = async (req, res) => {
  try {
    const { productId } = req.body;

    const existing = await Wardrobe.findOne({ user: req.user._id, product: productId });
    if (existing) {
      return res.status(400).json({ message: 'Item already in wardrobe' });
    }

    const wardrobeItem = await Wardrobe.create({
      user: req.user._id,
      product: productId,
    });

    res.status(201).json(wardrobeItem);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add item', error: err.message });
  }
};

exports.getWardrobe = async (req, res) => {
  try {
    const items = await Wardrobe.find({ user: req.user._id }).populate('product');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch wardrobe', error: err.message });
  }
};

exports.removeFromWardrobe = async (req, res) => {
  try {
    const item = await Wardrobe.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!item) {
      return res.status(404).json({ message: 'Wardrobe item not found' });
    }

    res.json({ message: 'Item removed from wardrobe' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove item', error: err.message });
  }
};