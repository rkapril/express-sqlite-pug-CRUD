const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "pug");

app.use(express.urlencoded({ extended: true }));

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/products.db");

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/viewAllProducts", function (req, res) {
  db.all("SELECT * FROM products ORDER BY product_id ASC", (err, rows) => {
    res.render("viewAllProducts", { products: rows });
  });
});

app.get("/createNewProduct", function (req, res) {
  res.render("createNewProduct");
});

app.post("/createNewProduct", function (req, res) {
  db.run(
    `INSERT INTO products (sku_code, product_name, product_description, brand, model, category, quantity_on_hand, unit_price) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.body.sku_code,
      req.body.product_name,
      req.body.product_description,
      req.body.brand,
      req.body.model,
      req.body.category,
      req.body.quantity_on_hand,
      req.body.unit_price,
    ],
    function (err) {
      if (err) {
        console.log(err.message);
        res.send("Error creating new product: " + err.message);
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
      res.send(
        "Product created with new Product ID: " +
          this.lastID +
          ' <a href="/">Home</a>'
      );
    }
  );
});

app.get("/updateProduct/:product_id", function (req, res) {
  db.get(
    "SELECT * FROM products WHERE product_id = ?",
    [req.params.product_id],
    (err, row) => {
      if (err) {
        console.log(err.message);
        res.send("Error retrieving product: " + err.message);
      }
      res.render("updateProduct", { product: row });
    }
  );
});

app.post("/updateProduct/:product_id", function (req, res) {
  db.run(
    `UPDATE products SET sku_code = ?, product_name = ?, product_description = ?, brand = ?, model = ?, category = ?, quantity_on_hand = ?, unit_price = ? WHERE product_id = ?`,
    [
      req.body.sku_code,
      req.body.product_name,
      req.body.product_description,
      req.body.brand,
      req.body.model,
      req.body.category,
      req.body.quantity_on_hand,
      req.body.unit_price,
      req.params.product_id,
    ],
    function (err) {
      if (err) {
        console.log(err.message);
        res.send("Error updating product: " + err.message);
      }
      console.log(`Product with ID ${req.params.product_id} updated`);
      res.send('Product updated successfully <a href="/">Home</a>');
    }
  );
});

app.get("/deleteProduct/:product_id", function (req, res) {
  db.get(
    "SELECT * FROM products WHERE product_id = ?",
    [req.params.product_id],
    (err, row) => {
      if (err) {
        console.log(err.message);
        res.send("Error retrieving product: " + err.message);
      }
      res.render("deleteProduct", { product: row });
    }
  );
});

app.post("/deleteProduct/:product_id", function (req, res) {
  db.run(
    "DELETE FROM products WHERE product_id = ?",
    [req.params.product_id],
    function (err) {
      if (err) {
        console.log(err.message);
        res.send("Error deleting product: " + err.message);
      }
      console.log(`Product with ID ${req.params.product_id} deleted`);
      res.send('Product deleted successfully <a href="/">Home</a>');
    }
  );
});

app.listen(port, function () {
  console.log(`Express app listening on port ${port}!`);
});
