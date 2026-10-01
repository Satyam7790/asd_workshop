const cache = {};

const TTL = 60000;

function clearCache() {
  for (const key of Object.keys(cache)) {
    delete cache[key];
  }
}

function clearCacheKey(key) {
  delete cache[key];
}

function invalidateProductCaches(id) {
  clearCacheKey("/products");
  if (id !== undefined && id !== null) {
    clearCacheKey(`/products/${id}`);
  }
}

module.exports = {
  cache,
  TTL,
  clearCache,
  clearCacheKey,
  invalidateProductCaches,
};
