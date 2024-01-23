import { v4 as uuidv4 } from "uuid";
import FileManager from "../utils/FileManager.js";

import Validate from "../utils/Validate.js";

class ProductManager {
  constructor() {
    this.fileManager = new FileManager("./src/database/products.json");
    this.products = [];
  }

  addProduct = async (data) => {
    const {
      title,
      description,
      price,
      status,
      code,
      stock,
      category,
      thumbnails,
    } = data;
    const requiredFields = [
      "title",
      "description",
      "code",
      "price",
      "stock",
      "status",
      "category",
    ];
    const newProduct = {
      title,
      description,
      price,
      status,
      code,
      stock,
      category,
      thumbnails,
      id: uuidv4(),
    };
    this.products = await this.fileManager.getFromFile();
    Validate.unique(newProduct, this.products, "code");
    Validate.requiredProps(newProduct, requiredFields);
    this.products.push(newProduct);
    this.fileManager.saveInFile(this.products);
  };

  getProducts = () => {
    return this.fileManager.getFromFile();
  };

  getProductById = (id) => {
    return this.fileManager.getFromFileByID(id);
  };

  getProductWithLimit(limit) {
    return this.fileManager.getFromFileWithLimit(limit);
  }

  updateProducts = (id, data) => {
    const {
      title,
      description,
      price,
      status,
      code,
      stock,
      category,
      thumbnails,
    } = data;

    const newValues = {
      title,
      description,
      price,
      status,
      code,
      stock,
      category,
      thumbnails,
    };

    this.fileManager.updateInFile(id, newValues);
  };

  deleteProducts = (id) => {
    this.fileManager.deleteInFile(id);
  };
}

export default new ProductManager();
