const { uploadToS3 } = require("../service/uploadToS3");
const { getEditedVideo } = require("../service/getEditedVideo");
const { downloadIngredients } = require("../service/downloadIngredients");

exports.editVideo = async (req, res) => {
  try {
    const downloadedFiles = await downloadIngredients(req.body);
    const editedFile = await getEditedVideo(req.body, downloadedFiles);
    const finalVideoUrl = await uploadToS3(editedFile, "edited");

    res.send({
      success: true,
      url: finalVideoUrl,
    });
  } catch (error) {
    console.error("Error occured while rendering final edited video:", error);
    return { success: false, error };
  }
};
