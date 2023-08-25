const { clearDirectories } = require("../service/clearDirectories");

exports.cleanup = async (req, res) => {
  try {
    await clearDirectories();
  } catch (error) {
    console.error("Error occured:", error);
    return { success: false, error };
  }
};
