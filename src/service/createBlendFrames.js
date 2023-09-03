const CreateError = require("http-errors");
const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

const { NO_FRAME_EXISTS } = require("../constants/error");
const { ensureFolderExists } = require("../util/ensureFolderExists");
const {
  SAVING_DIR_BLEND_FRAMES,
  SAVING_DIR_DOWNSCALED_FRAMES,
} = require("../constants/paths");

exports.createBlendFrames = async () => {
  ensureFolderExists(SAVING_DIR_BLEND_FRAMES);

  try {
    const files = await fs.readdir(SAVING_DIR_DOWNSCALED_FRAMES, {
      withFileTypes: true,
    });
    const downscaleFilesNum = files.length;

    if (!downscaleFilesNum) {
      throw CreateError(400, NO_FRAME_EXISTS);
    }

    for (let i = 1; i < downscaleFilesNum; i++) {
      const currentImage = path.join(SAVING_DIR_DOWNSCALED_FRAMES, `${i}.png`);
      const nextImage = path.join(SAVING_DIR_DOWNSCALED_FRAMES, `${i + 1}.png`);

      await sharp(currentImage)
        .composite([{ input: nextImage, blend: "difference" }])
        .toFile(path.join(SAVING_DIR_BLEND_FRAMES, `${i}.png`), (error) => {
          if (error) throw error;
        });
    }

    return downscaleFilesNum;
  } catch (error) {
    console.error("Error while creating blend frames:", error);
    throw error;
  }
};
