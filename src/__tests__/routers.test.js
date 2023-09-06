const request = require("supertest");
const app = require("../../app");

describe("router test", () => {
  it("Check if the function returned array", async () => {
    const res = await request(app).get("/").expect(200);

    expect(res.body).toEqual({ success: true });
  });
});
