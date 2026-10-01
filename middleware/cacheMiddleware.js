const { cache, TTL } = require("../utils/cache");

function cacheMiddleware(req, res, next) {
  const key = req.originalUrl;
  const entry = cache[key];

  if (entry) {
    const age = Date.now() - entry.createdAt;
    if (age < TTL) {
      res.set("X-Cache", "HIT");
      return res.json(entry.value);
    }
    delete cache[key];
  }

  const originalJson = res.json.bind(res);

  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache[key] = { value: body, createdAt: Date.now() };
    }
    res.set("X-Cache", "MISS");
    return originalJson(body);
  };

  next();
}

module.exports = cacheMiddleware;
