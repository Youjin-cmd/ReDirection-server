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

    res.send({
      success: true,
      url: croppedVideoUrl,
    });
  } catch (error) {
    console.error("Something went wrong:", error);
    return { success: false, error };
  }
};
