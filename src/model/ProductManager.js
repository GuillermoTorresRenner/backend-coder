const fs = require("fs").promises;

class ProductManager {
  static #id = 1;

  constructor() {
    this.fileManager = new FileManager();
    this.products = [];
  }

  #validateUniqueProductCode = (product) => {
    const productExist = this.products.some((p) => p.code === product.code);
    if (productExist) throw new Error("Producto ya ingresado en la lista");
  };
  #validateRequiredProductProps = (product) => {
    for (const prop in product) {
      if (product[prop] === null || product[prop] === undefined) {
        throw new TypeError(`La propiedad ${prop} es un valor requerido.`);
      }
    }
  };
  addProduct = (product) => {
    try {
      this.#validateUniqueProductCode(product);
      this.#validateRequiredProductProps(product);
      this.products.push({ ...product, id: ProductManager.#id++ });
      this.fileManager.saveInFile(this.products);
    } catch (error) {
      console.error(error.message);
    }
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

  updateProducts = (id, newValues) => {
    this.fileManager.updateInFile(id, newValues);
  };

  deleteProducts = (id) => {
    this.fileManager.deleteInFile(id);
  };
}
class Product {
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

class FileManager {
  constructor() {
    this.path = "products.txt";
  }

  saveInFile = async (productsList) => {
    try {
      await fs.writeFile(this.path, JSON.stringify(productsList));
    } catch (error) {
      console.log("Ocurrió unerror guardando productos en el archivo: ", error);
    }
  };

  getFromFile = async () => {
    try {
      const savedProducts = await fs.readFile(this.path, "utf-8");
      return JSON.parse(savedProducts);
    } catch (error) {
      console.log("Error obteniendodatos desde archivo:", error);
    }
  };
  getFromFileByID = async (id) => {
    try {
      const savedProducts = await fs.readFile(this.path, "utf-8");
      const productsList = JSON.parse(savedProducts);
      const foundedProduct = productsList.find((p) => p.id == id);
      //console.log(foundedProduct || `Product with id: ${id} Not found`);
      return foundedProduct
        ? foundedProduct
        : `No existe un producto con id: ${id}`;
    } catch (error) {
      console.log("Error obteniendodatos desde archivo:", error);
    }
  };
  getFromFileWithLimit = async (limit) => {
    try {
      const savedProducts = await fs.readFile(this.path, "utf-8");
      const data = JSON.parse(savedProducts);
      let limitData = [];

      for (let index = 0; index < limit; index++) {
        limitData.push(data[index]);
      }

      return limitData;
    } catch (error) {
      console.log("Error obteniendodatos desde archivo:", error);
    }
  };

  deleteInFile = async (id) => {
    try {
      const savedProducts = await fs.readFile(this.path, "utf-8");
      console.log(savedProducts);
      const productsList = JSON.parse(savedProducts);
      const newList = productsList.filter((p) => p.id !== id);
      if (!newList) return;
      this.saveInFile(newList);
    } catch (error) {
      console.log(
        "Ocurrió un error eliminando un registro desde archivo",
        error
      );
    }
  };

  updateInFile = async ({ id, ...newValue }) => {
    try {
      const savedProducts = await fs.readFile(this.path, "utf-8");
      const productsList = JSON.parse(savedProducts);
      const newList = productsList.filter((p) => p.id !== id);
      if (!newList) return;
      const updatedList = [...newList, { ...newValue, id }];
      updatedList.sort((a, b) => a.id - b.id);
      this.saveInFile(updatedList);
    } catch (error) {
      console.log("Ocurrió un error eliminando un registro desde archivo");
    }
  };
}
//===============================TESTING=============================================

//Instanciación de productos
const p1 = new Product(
  "Aceite",
  "Aceite de girasol",
  2500,
  "http://...",
  "123123",
  12
);

const p2 = new Product(
  "Azúcar",
  "Azúcar la gorda",
  2500,
  "http://...",
  "123124",
  15
);

const p3 = new Product(
  "Arroz",
  "Arroz blanco",
  3000,
  "http://...",
  "123125",
  20
);

const p4 = new Product(
  "Leche",
  "Leche desnatada",
  3500,
  "http://...",
  "123126",
  10
);

const p5 = new Product(
  "Pasta",
  "Pasta de trigo",
  2000,
  "http://...",
  "123127",
  18
);

const p6 = new Product(
  "Harina",
  "Harina de trigo",
  1800,
  "http://...",
  "123128",
  25
);

const p7 = new Product(
  "Café",
  "Café colombiano",
  5000,
  "http://...",
  "123129",
  8
);

const p8 = new Product(
  "Chocolate",
  "Chocolate negro",
  2800,
  "http://...",
  "123130",
  14
);

const p9 = new Product(
  "Tomate enlatado",
  "Tomate triturado",
  1500,
  "http://...",
  "123131",
  30
);

const p10 = new Product(
  "Jabón",
  "Jabón líquido",
  2000,
  "http://...",
  "123132",
  22
);
//Agregado de productos al manager
const pm = new ProductManager();
pm.addProduct(p1);
pm.addProduct(p2);
pm.addProduct(p3);
pm.addProduct(p4);
pm.addProduct(p5);
pm.addProduct(p6);
pm.addProduct(p7);
pm.addProduct(p8);
pm.addProduct(p9);
pm.addProduct(p10);

//retorno de lista de productos
//pm.getProducts();

//Búsqueda de producto en la lista por id
//pm.getProductById(5);

//delete de producto en la lista por id
// pm.deleteProducts(2);

//Update Producto en la lista

const p11 = {
  title: "Talco para pies",
  description: "Talco a base de zinc",
  price: 5000,
  thumbnail: "http://...",
  code: "123132",
  stock: 4,
  id: 1,
};
pm.updateProducts(p11);

module.exports = new ProductManager();
