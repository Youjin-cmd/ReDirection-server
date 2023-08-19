const CreateError = require("http-errors");
const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

const { NO_FRAME_EXISTS } = require("../constants/error");
const { ensureFolderExists } = require("../util/ensureFolderExists");

exports.cropFrames = async (startPixelArray) => {
  const blendFolder = path.join(__dirname, "../../blend");
  const SAVING_DIR_CROPPED_FRAMES = path.join(__dirname, "../../cropped");
  ensureFolderExists(SAVING_DIR_CROPPED_FRAMES);

  try {
    const files = await fs.readdir(blendFolder);
    const filesNum = files.length;

    if (!filesNum) {
      throw CreateError(400, NO_FRAME_EXISTS);
    }

    for (let i = 1; i < filesNum; i++) {
      const currentImage = path.join(__dirname, `../../blend/${i}.png`);

      if (startPixelArray[i - 1] === undefined) {
        break;
      }

      await sharp(currentImage)
        .extract({
          width: 32,
          height: 56,
          left: startPixelArray[i - 1],
          top: 0,
        })
        .toFile(path.join(SAVING_DIR_CROPPED_FRAMES, `${i}.png`));
    }

    return { targetFolder: SAVING_DIR_CROPPED_FRAMES };
  } catch (error) {
    console.error("Error while processing:", error);
    throw error;
  }
};
