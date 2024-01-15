const { v4: uuidv4 } = require("uuid");
const FileManager = require("../utils/FileManager");

class CartManager {
  constructor() {
    this.fileManager = new FileManager("./src/database/carts.json");
    this.carts = [];
  }

  createNewCart = async () => {
    this.carts = await this.fileManager.getFromFile();
    const id = uuidv4();
    this.carts.push({
      id,
      products: [],
    });
    console.log(this.carts);

    await this.fileManager.saveInFile(this.carts);
    return id;
  };
  addToCart = async (cid, pid, quantity = 1) => {
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
