import { expect } from "chai";
import request from "supertest";
const requester = request("http://localhost:8080/api");

let cookie;

describe("Testing de endpoints /sessions", () => {
  it("el endpoint POST /sessions debe devolver una cookie con el token auth", async () => {
    const result = await requester.post("/sessions/login").send({
      email: "huayno@gmail.com",
      password: "123123",
    });
    const cookieResult = result.headers["set-cookie"][0];
    cookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1],
    };
    expect(cookie.name).to.equal("connect.sid");
    expect(cookie.value).to.be.ok;
  });
  it("el endpoint GET /sessions/current debe devolver info del user logueado ", async () => {
    const { statusCode, _body } = await requester
      .get("/sessions/current")
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    expect(statusCode).to.equal(200);
    expect(_body).to.be.an("object");
  });
  it("el endpoint GET /sessions/logout debe destruir la cookie de auth", async () => {
    const res = await requester
      .get("/sessions/logout")
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(res.headers["set-cookie"]).to.be.undefined;
  });
});
