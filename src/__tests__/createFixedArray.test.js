const { createFixedArray } = require("../service/createFixedArray");

describe("fixed coordinate array", () => {
  it("Check if motion detection will be ignored if width under 350 is passed from user", async () => {
    const leftEdge = 40;
    const filesNum = 20;
    const videoWidth = 1280;

    const result = await createFixedArray(leftEdge, filesNum, videoWidth);

    const areAllElementsSame = result.every((element) => element === result[0]);
    expect(areAllElementsSame).toBe(true);
  });
});
