import { expect } from "chai";
import request from "supertest";
const requester = request("http://localhost:8080/api");

describe("Testing the /carts/:cid endpoint", () => {
  let cookie;

  before(async () => {
    const res = await requester
      .post("/sessions/login")
      .send({ email: "torresrennerguillermo@gmail.com", password: "123123" });

    cookie = res.headers["set-cookie"][0];
  });

  it("el endpoint GET /carts/cid debe devolver status 200 y un objeto que representa el carro de compras con los productos agregados", async () => {
    const cid = "666a402ee2a51aa806ebb2f3";
    const { _body, statusCode } = await requester
      .get(`/carts/${cid}`)
      .set("Cookie", cookie);

    expect(statusCode).to.be.equal(200);
    expect(_body).to.be.an("object");
    expect(_body).to.have.property("products").that.is.an("array");
  });

  it("el endpoint GET /carts/cid debe devolver status 404 cuando se le pasa un cid inexistente", async () => {
    const cid = "invalid-cart-id";
    const { statusCode } = await requester
      .get(`/carts/${cid}`)
      .set("Cookie", cookie);

    expect(statusCode).to.equal(404);
  });
});
