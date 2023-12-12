const CreateError = require("http-errors");
const fs = require("fs").promises;

const {
  SAVING_DIR_VIDEO,
  SAVING_DIR_BLEND_FRAMES,
  SAVING_DIR_ORIGINAL_FRAMES,
  SAVING_DIR_CROPPED_FRAMES,
} = require("../constants/paths");

const { analyzePixelData } = require("../service/analyzePixelData");
const { optimizeArray } = require("../service/optimizeArray");
const { cropFrames } = require("../service/cropFrames");
const { reassembleFrames } = require("../service/reassembleFrames");
const { uploadToS3 } = require("../service/uploadToS3");
const { extractOriginalFrames } = require("../service/extractOriginalFrames");
const { createFixedArray } = require("../service/createFixedArray");
const { getMetaData } = require("../service/getMetaData");

exports.cropVideo = async (req, res) => {
  const { leftEdge, rightEdge, isFixed, sensitivity } = req.body;

  try {
    await extractOriginalFrames();
    const files = await fs.readdir(SAVING_DIR_BLEND_FRAMES);
    const filesNum = files.length;

    if (isFixed) {
      const fixedCoordArray = await createFixedArray(
        leftEdge,
        filesNum,
      );
      await cropFrames(fixedCoordArray);
    }

    if (!isFixed) {
      const motionAnalysisArray = await analyzePixelData(
        leftEdge,
        rightEdge,
        filesNum,
      );
      const optimizedArray = await optimizeArray(
        motionAnalysisArray,
        sensitivity,
      );
      await cropFrames(optimizedArray);
    }

    const assembledFile = await reassembleFrames("cropped");
    const croppedVideoUrl = await uploadToS3(assembledFile, "cropped");

    await fs.rm(SAVING_DIR_VIDEO, { recursive: true });
    await fs.rm(SAVING_DIR_BLEND_FRAMES, { recursive: true });
    await fs.rm(SAVING_DIR_ORIGINAL_FRAMES, { recursive: true });
    await fs.rm(SAVING_DIR_CROPPED_FRAMES, { recursive: true });

    res.send({
      success: true,
      url: croppedVideoUrl,
    });
  } catch (error) {
    throw new CreateError(error.status, error.message);
  }
};
