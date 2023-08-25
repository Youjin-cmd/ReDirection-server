const fs = require("fs").promises;
const {
  SAVING_DIR_VIDEO,
  SAVING_DIR_AUDIO,
  SAVING_DIR_BLEND_FRAMES,
  SAVING_DIR_DOWNSCALED_FRAMES,
  SAVING_DIR_ORIGINAL_FRAMES,
  SAVING_DIR_CROPPED_FRAMES,
  SAVING_DIR_RESULT,
  SAVING_DIR_EDITED_RESULT,
} = require("../constants/paths");

exports.clearDirectories = async () => {
  const directoriesToDelete = [
    SAVING_DIR_VIDEO,
    SAVING_DIR_AUDIO,
    SAVING_DIR_BLEND_FRAMES,
    SAVING_DIR_DOWNSCALED_FRAMES,
    SAVING_DIR_ORIGINAL_FRAMES,
    SAVING_DIR_CROPPED_FRAMES,
    SAVING_DIR_RESULT,
    SAVING_DIR_EDITED_RESULT,
  ];

  try {
    await Promise.all(
      directoriesToDelete.map(async (directory) => {
        await fs.rm(directory, { recursive: true });
        console.log(`Directory '${directory}' deleted successfully.`);
      }),
    );
  } catch (error) {
    console.log("alrady not existing: " + error);
  }
};
