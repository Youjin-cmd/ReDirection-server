const request = require("supertest");
const app = require("../../app");

describe("File upload", () => {
  it("should return 413 when too large file is given", async () => {
    const buffer = Buffer.alloc(1024 * 1024 * 200);

    await request(app)
      .post("/video/preview")
      .attach("video", buffer, { filename: "fakefile.mp4" })
      .expect(413);
  });
});
