const CreateError = require("http-errors");
const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

const { NO_FRAME_EXISTS } = require("../constants/error");
const { ensureFolderExists } = require("../util/ensureFolderExists");
const {
  SAVING_DIR_ORIGINAL_FRAMES,
  SAVING_DIR_CROPPED_FRAMES,
} = require("../constants/paths");

exports.cropFrames = async (startPixelArray) => {
  ensureFolderExists(SAVING_DIR_CROPPED_FRAMES);

  try {
    const files = await fs.readdir(SAVING_DIR_ORIGINAL_FRAMES, {
      withFileTypes: true,
    });
    const filesNum = files.length;

    if (!filesNum) {
      throw CreateError(400, NO_FRAME_EXISTS);
    }

    for (let i = 1; i < filesNum + 1; i++) {
      const currentImage = path.join(SAVING_DIR_ORIGINAL_FRAMES, `${i}.png`);

      await sharp(currentImage)
        .extract({
          width: 406,
          height: 720,
          left: startPixelArray[i - 1],
          top: 0,
        })
        .toFile(path.join(SAVING_DIR_CROPPED_FRAMES, `${i}.png`));
    }

    return { targetFolder: SAVING_DIR_CROPPED_FRAMES };
  } catch (error) {
    console.error("Error while cropping frames:", error);
    throw error;
  }
};
