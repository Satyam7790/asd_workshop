const fs = require("fs/promises");
const path = require("path");

const dbPath = path.join(__dirname, "..", "db.json");

const DELAY_MS = 1500;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readFile() {
  const data = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(data);
}
async function readFileWithDelay() {
  await delay(DELAY_MS);
  return readFile();
}

async function writeFile(products) {
  await fs.writeFile(dbPath, JSON.stringify(products, null, 2), "utf-8");
}

async function getAllProducts() {
  return readFileWithDelay();
}

async function getProductById(id) {
  const products = await readFileWithDelay();
  return products.find((product) => product.id === id) || null;
}


async function createProduct(product) {
  const products = await readFileWithDelay();
  products.push(product);
  await writeFile(products);
  return product;
}

async function updateProduct(id, updatedProduct) {
  const products = await readFileWithDelay();
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) return null;

  products[index] = updatedProduct;
  await writeFile(products);
  return updatedProduct;
}

async function patchProduct(id, changes) {
  const products = await readFileWithDelay();
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) return null;

  products[index] = { ...products[index], ...changes };
  await writeFile(products);
  return products[index];
}

async function deleteProduct(id) {
  const products = await readFileWithDelay();
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) return null;

  const [deleted] = products.splice(index, 1);
  await writeFile(products);
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
