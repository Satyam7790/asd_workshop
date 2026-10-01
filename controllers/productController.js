const productService = require("../services/productService");
const { invalidateProductCaches } = require("../utils/cache");

function parseId(raw) {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}
function handleError(res, error) {
  const status = error.status || 500;
  const message = error.status ? error.message : "Internal server error";
  res.status(status).json({ error: message });
}
async function getProducts(req, res) {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    handleError(res, error);
  }
}

async function getProductById(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Invalid product id" });
  }

  try {
    const product = await productService.getProductById(id);
    res.json(product);
  } catch (error) {
    handleError(res, error);
  }
}

async function createProduct(req, res) {
  try {
    const product = await productService.createProduct(req.body);
    invalidateProductCaches();
    res.status(201).json(product);
  } catch (error) {
    handleError(res, error);
  }
}
async function updateProduct(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Invalid product id" });
  }

  try {
    const product = await productService.updateProduct(id, req.body);
    invalidateProductCaches(id);
    res.json(product);
  } catch (error) {
    handleError(res, error);
  }
}
async function patchProduct(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Invalid product id" });
  }

  try {
    const product = await productService.patchProduct(id, req.body);
    invalidateProductCaches(id);
    res.json(product);
  } catch (error) {
    handleError(res, error);
  }
}

async function deleteProduct(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Invalid product id" });
  }

  try {
    const product = await productService.deleteProduct(id);
    invalidateProductCaches(id);
    res.json(product);
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
};
