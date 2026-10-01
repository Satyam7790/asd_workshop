const productDatabase = require("../database/productDatabase");

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}
function validateProduct(data, partial) {
  const errors = [];

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return ["Request body must be a JSON object"];
  }

  const hasName = data.name !== undefined;
  const hasPrice = data.price !== undefined;

  if (!partial && !hasName) errors.push("name is required");
  if (!partial && !hasPrice) errors.push("price is required");

  if (hasName && (typeof data.name !== "string" || data.name.trim() === "")) {
    errors.push("name must be a non-empty string");
  }
  if (hasPrice && (typeof data.price !== "number" || Number.isNaN(data.price))) {
    errors.push("price must be a number");
  }

  return errors;
}

async function getAllProducts() {
  return productDatabase.getAllProducts();
}

async function getProductById(id) {
  const product = await productDatabase.getProductById(id);
  if (!product) {
    throw httpError(404, `Product with id ${id} not found`);
  }
  return product;
}

async function createProduct(data) {
  const errors = validateProduct(data, false);
  if (errors.length > 0) {
    throw httpError(400, errors.join(", "));
  }

  const products = await productDatabase.getAllProducts();
  const nextId = products.reduce((max, product) => Math.max(max, product.id), 0) + 1;

  return productDatabase.createProduct({
    id: nextId,
    name: data.name,
    price: data.price,
  });
}

async function updateProduct(id, data) {
  const errors = validateProduct(data, false);
  if (errors.length > 0) {
    throw httpError(400, errors.join(", "));
  }

  const updated = await productDatabase.updateProduct(id, {
    id,
    name: data.name,
    price: data.price,
  });

  if (!updated) {
    throw httpError(404, `Product with id ${id} not found`);
  }
  return updated;
}

async function patchProduct(id, data) {
  const errors = validateProduct(data, true);
  if (errors.length > 0) {
    throw httpError(400, errors.join(", "));
  }

  const patched = await productDatabase.patchProduct(id, data);
  if (!patched) {
    throw httpError(404, `Product with id ${id} not found`);
  }
  return patched;
}

async function deleteProduct(id) {
  const deleted = await productDatabase.deleteProduct(id);
  if (!deleted) {
    throw httpError(404, `Product with id ${id} not found`);
  }
  return deleted;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
};
