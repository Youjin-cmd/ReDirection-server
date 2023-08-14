const CreateError = require("http-errors");
const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

const { NO_FRAME_EXISTS } = require("../constants/error");
const ensureFolderExists = require("../utils/ensureFolderExists");

exports.createBlendFrames = async () => {
  const downscaleFolder = path.join(__dirname, "../../downscale");
  const SAVING_DIR_BLEND_FRAMES = path.join(__dirname, "../../blend");
  ensureFolderExists(SAVING_DIR_BLEND_FRAMES);

  try {
    const files = await fs.readdir(downscaleFolder);
    const filesNum = files.length;

    if (filesNum <= 1) {
      throw CreateError(400, NO_FRAME_EXISTS);
    }

    for (let i = 1; i < filesNum; i++) {
      const currentImage = path.join(__dirname, `../../downscale/${i}.png`);
      const nextImage = path.join(__dirname, `../../downscale/${i + 1}.png`);

      await sharp(currentImage)
        .composite([{ input: nextImage, blend: "difference" }])
        .toFile(
          path.join(SAVING_DIR_BLEND_FRAMES, `result_${i}.png`),
          (error) => {
            if (error) throw error;
          },
        );
    }
  } catch (error) {
    console.error("Error while processing:", error);
    throw error;
  }
};
