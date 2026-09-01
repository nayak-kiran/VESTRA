const Product = require('../models/Product');
const Wardrobe = require('c:/VESTRA/backend/models/wardrobe.js');
const { buildVocabulary, vectorizeProduct } = require('../utils/vectorize');
const cosineSimilarity = require('../utils/similarity');

exports.getRecommendations = async (req, res) => {
  try {
    const allProducts = await Product.find();
    const wardrobeItems = await Wardrobe.find({ user: req.user._id }).populate('product');

    if (wardrobeItems.length === 0) {
      return res.json({
        message: 'Add items to your wardrobe to get personalized recommendations',
        recommendations: [],
      });
    }

    const vocab = buildVocabulary(allProducts);
    const wardrobeProductIds = wardrobeItems.map((item) => item.product._id.toString());

    const wardrobeVectors = wardrobeItems.map((item) =>
      vectorizeProduct(item.product, vocab)
    );

    const vectorLength = wardrobeVectors[0].length;
    const userVector = Array(vectorLength).fill(0);

    wardrobeVectors.forEach((vec) => {
      vec.forEach((val, i) => {
        userVector[i] += val / wardrobeVectors.length;
      });
    });

    const candidates = allProducts.filter(
      (p) => !wardrobeProductIds.includes(p._id.toString())
    );

    const scored = candidates.map((product) => {
      const productVector = vectorizeProduct(product, vocab);
      const score = cosineSimilarity(userVector, productVector);
      return { product, score };
    });

    scored.sort((a, b) => b.score - a.score);

    const topRecommendations = scored.slice(0, 5);

    res.json({ recommendations: topRecommendations });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate recommendations', error: err.message });
  }
};