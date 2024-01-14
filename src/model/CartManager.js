const { v4: uuidv4 } = require("uuid");
const FileManager = require("../utils/FileManager");
const productManager = require("../model/ProductManager"); //sremover quizás
const Validate = require("../utils/Validate");
const { json } = require("express");

class CartManager {
  constructor() {
    this.fileManager = new FileManager("./src/database/carts.json");
    this.carts = [];
  }

  addToCart = async (cid, pid, quantity) => {
    this.carts = await this.fileManager.getFromFile();
    const foundedCart = this.carts.find((c) => c.id === cid);

    if (foundedCart) {
      const foundedProduct = foundedCart.products.find((p) => p.id === pid);
      if (foundedProduct) {
        foundedProduct.quantity += quantity;
        const index = foundedCart.products.findIndex((elemento) => {
          if (elemento.id === pid) {
            return true;
          }
        });
        foundedCart.products[index] = foundedProduct;
        this.fileManager.updateInFile(cid, foundedCart);
      } else {
        foundedCart.products.push({ id: pid, quantity });
        this.fileManager.updateInFile(cid, foundedCart);
      }
    } else {
      this.carts.push({
        id: uuidv4(),
        products: [{ id: pid, quantity }],
      });
      this.fileManager.saveInFile(this.carts);
    }
  };

  getCartById = (id) => {
    return this.fileManager.getFromFileByID(id);
  };
}

module.exports = new CartManager();
