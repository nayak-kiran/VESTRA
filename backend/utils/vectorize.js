const buildVocabulary = (products) => {
  const categories = [...new Set(products.map((p) => p.category))];
  const colors = [...new Set(products.map((p) => p.color))];
  const occasions = [...new Set(products.flatMap((p) => p.occasion))];
  const seasons = [...new Set(products.flatMap((p) => p.season))];
  const tags = [...new Set(products.flatMap((p) => p.tags))];

  return { categories, colors, occasions, seasons, tags };
};

const vectorizeProduct = (product, vocab) => {
  const categoryVec = vocab.categories.map((c) => (product.category === c ? 1 : 0));
  const colorVec = vocab.colors.map((c) => (product.color === c ? 1 : 0));
  const occasionVec = vocab.occasions.map((o) => (product.occasion.includes(o) ? 1 : 0));
  const seasonVec = vocab.seasons.map((s) => (product.season.includes(s) ? 1 : 0));
  const tagVec = vocab.tags.map((t) => (product.tags.includes(t) ? 1 : 0));

  return [...categoryVec, ...colorVec, ...occasionVec, ...seasonVec, ...tagVec];
};

module.exports = { buildVocabulary, vectorizeProduct };