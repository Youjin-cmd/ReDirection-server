const CreateError = require("http-errors");
const fs = require("fs").promises;

const {
  SAVING_DIR_ORIGINAL_FRAMES,
  SAVING_DIR_CROPPED_FRAMES,
} = require("../constants/paths");

const { cropFrames } = require("../service/cropFrames");
const { reassembleFrames } = require("../service/reassembleFrames");
const { uploadToS3 } = require("../service/uploadToS3");
const { extractOriginalFrames } = require("../service/extractOriginalFrames");

exports.cropVideo = async (req, res) => {
  try {
    await extractOriginalFrames();
    const result = await cropFrames(req.body);
    const assembledFile = await reassembleFrames(
      result.targetFolder,
      "cropped",
    );
    const croppedVideoUrl = await uploadToS3(assembledFile, "cropped");

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
