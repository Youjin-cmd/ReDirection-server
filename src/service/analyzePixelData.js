const CreateError = require("http-errors");
const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

const { NO_IMAGE_EXISTS } = require("../constants/error");
const {
  BLEND_FRAME_WIDTH,
  BLEND_FRAME_HEIGHT,
  MOTION_THRESHOLD,
} = require("../constants/constant");

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

exports.analyzePixelData = async () => {
  const blendFolder = path.join(__dirname, "../../blend");
  const startPixelArray = [];

  try {
    const files = await fs.readdir(blendFolder);
    const filesNum = files.length;

    if (!filesNum) {
      throw CreateError(400, NO_IMAGE_EXISTS);
    }

    for (let i = 1; i < filesNum; i++) {
      const currentImage = path.join(__dirname, `../../blend/${i}.png`);

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

    return { startPixelArray, targetFolder: blendFolder };
  } catch (error) {
    console.error("Error processing the image:", error);
  }
};
