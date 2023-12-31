const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const execFile = require("child_process").spawn;
const path = require("path");
const fs = require("fs");

const { ensureFolderExists } = require("../util/ensureFolderExists");
const {
  SAVING_DIR_VIDEO,
  SAVING_DIR_ORIGINAL_FRAMES,
} = require("../constants/paths");

exports.extractOriginalFrames = async () => {
  ensureFolderExists(SAVING_DIR_ORIGINAL_FRAMES);

  const files = fs.readdirSync(SAVING_DIR_VIDEO);
  const firstFile = files[0];

  const ffmpegOriginal = execFile(ffmpegPath, [
    "-i",
    path.join(SAVING_DIR_VIDEO, firstFile),
    "-r",
    "25",
    "-vf",
    "scale=1280:720",
    "-y",
    path.join(SAVING_DIR_ORIGINAL_FRAMES, "%01d.png"),
  ]);

  return new Promise((resolve, reject) => {
    ffmpegOriginal.stdout.on("data", (data) => {
      process.stdout.write(data.toString());
    });

    ffmpegOriginal.stderr.on("data", (data) => {
      process.stderr.write(data.toString());
    });

    ffmpegOriginal.on("close", resolve);

    ffmpegOriginal.on("error", () => {
      console.error("Error occured extracting original frames:", reject);
    });
  });
};
