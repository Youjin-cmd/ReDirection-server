const CreateError = require("http-errors");
const fs = require("fs").promises;

const { UPLOAD_FAILED } = require("../constants/error");
const {
  SAVING_DIR_VIDEO,
  SAVING_DIR_DOWNSCALED_FRAMES,
} = require("../constants/paths");

const {
  extractDownscaledFrames,
} = require("../service/extractDownscaledFrames");
const { extractAudio } = require("../service/extractAudio");
const { createBlendFrames } = require("../service/createBlendFrames");
const { reassembleFrames } = require("../service/reassembleFrames");
const { uploadToS3 } = require("../service/uploadToS3");
const { getMetaData } = require("../service/getMetaData");

exports.createPreviewVideo = async (req, res) => {
  if (!req.file) {
    throw CreateError(400, UPLOAD_FAILED);
  }

  try {
    await getMetaData();
    await extractDownscaledFrames(req.file);
    await extractAudio(req.file);
    await createBlendFrames();
    const assembledFile = await reassembleFrames("blend");
    const analysisVideoUrl = await uploadToS3(assembledFile, "preview");

    await fs.rm(SAVING_DIR_DOWNSCALED_FRAMES, { recursive: true });

    res.send({
      success: true,
      url: analysisVideoUrl,
    });
  } catch (error) {
    await fs.rm(SAVING_DIR_VIDEO, { recursive: true });
    throw new CreateError(error.status, error.message);
  }
};
