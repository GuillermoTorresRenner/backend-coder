/*
Este archivo define una clase para generar datos ficticios de productos utilizando la biblioteca faker.
 Se utiliza principalmente para pruebas o para poblar la base de datos con datos de muestra.
 */

import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

// Define la estructura de un producto con datos ficticios.
class Product {
  constructor() {
    this.id = faker.datatype.uuid();
    this.title = faker.commerce.productName();
    this.description = faker.commerce.productDescription();
    this.price = faker.commerce.price();
    this.status = true;
    this.code = uuidv4();
    this.stock = faker.datatype.number({ min: 1, max: 100 });
    this.category = faker.commerce.department();
    this.thumbnails = faker.image.imageUrl();
  }
}

// Clase para generar y manejar una colección de productos ficticios.
export default class Mocking {
  #products = [];

  // Genera y devuelve una lista de 100 productos ficticios.
  static getProducts() {
    const products = [];
    for (let i = 0; i < 100; i++) {
      const product = new Product();
      products.push(product);
    }
    return products;
  }
}
