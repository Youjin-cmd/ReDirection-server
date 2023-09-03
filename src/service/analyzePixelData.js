const CreateError = require("http-errors");
const sharp = require("sharp");
const path = require("path");

const { NO_FRAME_EXISTS } = require("../constants/error");
const {
  BLEND_FRAME_WIDTH,
  BLEND_FRAME_HEIGHT,
  MOTION_THRESHOLD,
} = require("../constants/constant");
const { SAVING_DIR_BLEND_FRAMES } = require("../constants/paths");

function calculateImageScore(imageData) {
  const motionDetectedPixels = [];

  for (let row = 0; row < BLEND_FRAME_WIDTH; row++) {
    let columnScore = 0;

    for (let col = 0; col < BLEND_FRAME_HEIGHT; col++) {
      const pixelIndex = row * 4 + col * BLEND_FRAME_WIDTH * 4;

      const r = imageData[pixelIndex];
      const g = imageData[pixelIndex + 1];
      const b = imageData[pixelIndex + 2];
      const pixelScore = r + g + b;

      columnScore += pixelScore;
    }

    if (columnScore > MOTION_THRESHOLD) {
      motionDetectedPixels.push(row);
    }
  }

  const centerOfMovedArea =
    motionDetectedPixels[Math.floor(motionDetectedPixels.length / 2)];

  return centerOfMovedArea;
}

exports.analyzePixelData = async (downscaleFilesNum) => {
  const startPixelArray = [];
  const blendFilesNum = downscaleFilesNum - 1;

  if (!downscaleFilesNum) {
    throw CreateError(400, NO_FRAME_EXISTS);
  }

  try {
    for (let i = 1; i < blendFilesNum + 1; i++) {
      const currentImage = path.join(SAVING_DIR_BLEND_FRAMES, `${i}.png`);

      await sharp(currentImage)
        .raw()
        .toBuffer({ resolveWithObject: true })
        .then(({ data, info }) => {
          const leftEdge = calculateImageScore(data) - 16;
          if (leftEdge) {
            startPixelArray.push(leftEdge);
          } else {
            startPixelArray.push(0);
          }
        });
    }

    return { startPixelArray, targetFolder: SAVING_DIR_BLEND_FRAMES };
  } catch (error) {
    console.error("Error while analyzing pixel data:", error);
  }
};
