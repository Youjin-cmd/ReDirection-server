const fs = require("fs").promises;
const {
  SAVING_DIR_VIDEO,
  SAVING_DIR_AUDIO,
  SAVING_DIR_BLEND_FRAMES,
  SAVING_DIR_DOWNSCALED_FRAMES,
  SAVING_DIR_ORIGINAL_FRAMES,
  SAVING_DIR_CROPPED_FRAMES,
  SAVING_DIR_RESULT,
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
  ];

  try {
    for (const directory of directoriesToDelete) {
      await fs.rmdir(directory, { recursive: true });
      console.log(`Directory '${directory}' deleted successfully.`);
    }
  } catch (error) {
    console.error("Error while deleting directory:", error);
    throw error;
  }
};
