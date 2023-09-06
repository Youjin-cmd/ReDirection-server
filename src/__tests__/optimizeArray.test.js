const { optimizeArray } = require("../service/optimizeArray");

describe("optimize coordinates Array", () => {
  it("Check if the function returned array", async () => {
    const motionAnalysisArray = [31, 33, 0, 34, 33, 0, 32, 0, 32, 33];
    const sensitivity = 15;
    const videoWidth = 1280;

    const result = await optimizeArray(
      motionAnalysisArray,
      sensitivity,
      videoWidth,
    );

    expect(Array.isArray(result)).toBe(true);
  });

  it("Check if the function removed 0", async () => {
    const motionAnalysisArray = [31, 33, 0, 34, 33, 0, 32, 0, 32, 33];
    const sensitivity = 15;
    const videoWidth = 1280;

    const result = await optimizeArray(
      motionAnalysisArray,
      sensitivity,
      videoWidth,
    );

    expect(result.includes(0)).toBe(false);
  });
});
