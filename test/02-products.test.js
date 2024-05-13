import { expect } from "chai";
import request from "supertest";
const requester = request("http://localhost:8080/api");
import __dirname from "../__dirname.js";
import { v4 as uuidv4 } from "uuid";
describe("Testing de endpoints /products", () => {
  let cookie;

  before(async () => {
    const res = await requester
      .post("/sessions/login")
      .send({ email: "torresrennerguillermo@gmail.com", password: "123123" });

    // Guarda la cookie para usarla en las siguientes peticiones
    cookie = res.headers["set-cookie"][0];
  });

  it("el endpoint GET /products debe devolver status 200 y un array con productos", async () => {
    const { statusCode, body } = await requester
      .get("/products")
      .set("Cookie", cookie); // Usa la cookie en la petición

    expect(statusCode).to.equal(200);
    expect(body.payload).to.be.an("array");
  });

  it("el endpoint GET /products/:pid debe devolver status 200 y un objeto producto", async () => {
    const { statusCode, body } = await requester
      .get("/products/65d286a4bd9e943d69d5b3d6")
      .set("Cookie", cookie);

    expect(statusCode).to.equal(200);
    expect(body).to.be.an("object");
  });

  it("el endpoint POST /products debe devolver status 201 y el producto creado", async () => {
    const code = uuidv4();
    const { statusCode } = await requester
      .post("/products")
      .set("Cookie", cookie)
      .field("title", "Producto de prueba")
      .field("description", "producto creado para testear")
      .field("price", 120000)
      .field("status", true)
      .field("code", code)
      .field("stock", 23)
      .field("category", "infusiones")
      .attach("img", `${__dirname}/test/test.jpeg`);

    expect(statusCode).to.be.equal(201);
  });
  // it("el endpoint DELETE debe devolver status 200 tras borrar un objeto producto", async () => {
  //   const { statusCode } = await requester
  //     .delete(`/products/664173aa608f87e8ab68a06d`)
  //     .set("Cookie", cookie);
  //   expect(statusCode).to.be.ok;
  // });
});
