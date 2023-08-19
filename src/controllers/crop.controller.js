const { cropFrames } = require("../service/cropFrames");
const { reassembleFrames } = require("../service/reassembleFrames");
const { uploadToS3 } = require("../service/uploadToS3");
const { clearDirectories } = require("../service/clearDirectories");

exports.cropVideo = async (req, res) => {
  try {
    const result = await cropFrames(req.body);
    const assembledFile = await reassembleFrames(result.targetFolder);
    const analysisVideoUrl = await uploadToS3(assembledFile, "cropped");
    await clearDirectories();

    res.send({
      success: true,
      url: analysisVideoUrl,
    });
  } catch (error) {
    console.error("Something went wrong:", error);
    return { success: false, error };
  }
};
