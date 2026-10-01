const express = require("express");
const productRoutes = require("./routes/productRoutes");

const app = express();
const port = 3000;

// Parse JSON request bodies (for like POST/PUT/PATCH)
app.use(express.json());
app.use(productRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
