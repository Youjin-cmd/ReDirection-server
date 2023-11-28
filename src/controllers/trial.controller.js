const CreateError = require("http-errors");
const fs = require("fs").promises;
const path = require("path");

const {
  SAVING_DIR_VIDEO,
  SAVING_DIR_DOWNSCALED_FRAMES,
  ASSETS_DIR,
} = require("../constants/paths");
const { ensureFolderExists } = require("../util/ensureFolderExists");

const {
  extractDownscaledFrames,
} = require("../service/extractDownscaledFrames");
const { extractAudio } = require("../service/extractAudio");
const { createBlendFrames } = require("../service/createBlendFrames");
const { reassembleFrames } = require("../service/reassembleFrames");
const { uploadToS3 } = require("../service/uploadToS3");
const { getMetaData } = require("../service/getMetaData");

exports.createTrialPreview = async (req, res) => {
  try {
    ensureFolderExists(SAVING_DIR_VIDEO);
    const sourcePath = path.join(ASSETS_DIR, `trial_${req.params.id}.mp4`);
    const targetPath = path.join(SAVING_DIR_VIDEO, `trial_${req.params.id}.mp4`);

    await fs.copyFile(sourcePath, targetPath);
    console.log("Trial video file copied successfully.");

    const trialVideoFile = {
      path: targetPath,
    }

    await getMetaData();
    await extractDownscaledFrames(trialVideoFile);
    await extractAudio(trialVideoFile);
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
