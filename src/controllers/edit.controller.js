const CreateError = require("http-errors");
const fs = require("fs").promises;

const {
  SAVING_DIR_VIDEO,
  SAVING_DIR_AUDIO,
  SAVING_DIR_RESULT,
  SAVING_DIR_INGREDIENTS,
  SAVING_DIR_EDITED_RESULT,
} = require("../constants/paths");

const { uploadToS3 } = require("../service/uploadToS3");
const { getEditedVideo } = require("../service/getEditedVideo");
const { downloadIngredients } = require("../service/downloadIngredients");

exports.editVideo = async (req, res) => {
  try {
    const downloadedFiles = await downloadIngredients(req.body);
    const editedFile = await getEditedVideo(req.body, downloadedFiles);
    const finalVideoUrl = await uploadToS3(editedFile, "edited");

    await fs.rm(SAVING_DIR_VIDEO, { recursive: true });
    await fs.rm(SAVING_DIR_AUDIO, { recursive: true });
    await fs.rm(SAVING_DIR_RESULT, { recursive: true });
    await fs.rm(SAVING_DIR_INGREDIENTS, { recursive: true });
    await fs.rm(SAVING_DIR_EDITED_RESULT, { recursive: true });

    res.send({
      success: true,
      url: finalVideoUrl,
    });
  } catch (error) {
    throw new CreateError(error.status, error.message);
  }
};
