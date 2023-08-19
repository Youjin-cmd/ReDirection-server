const fs = require("fs").promises;
const path = require("path");

exports.clearDirectories = async () => {
  const directoriesToDelete = [
    path.join(__dirname, "../../cropped"),
    path.join(__dirname, "../../blend"),
    path.join(__dirname, "../../downscale"),
    path.join(__dirname, "../../video"),
    path.join(__dirname, "../../audio"),
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
