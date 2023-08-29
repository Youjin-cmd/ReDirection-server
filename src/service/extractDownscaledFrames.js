const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const execFile = require("child_process").spawn;
const path = require("path");

const { ensureFolderExists } = require("../util/ensureFolderExists");
const { SAVING_DIR_DOWNSCALED_FRAMES } = require("../constants/paths");

exports.extractDownscaledFrames = async (file) => {
  ensureFolderExists(SAVING_DIR_DOWNSCALED_FRAMES);

  const ffmpegDownscale = execFile(ffmpegPath, [
    "-i",
    file.path,
    "-vf",
    "scale=100:-1",
    "-r",
    "13",
    "-pix_fmt",
    "pal8",
    "-y",
    path.join(SAVING_DIR_DOWNSCALED_FRAMES, "%01d.png"),
  ]);

  return new Promise((resolve, reject) => {
    ffmpegDownscale.stdout.on("data", (data) => {
      process.stdout.write(data.toString());
    });

    ffmpegDownscale.stderr.on("data", (data) => {
      process.stderr.write(data.toString());
    });

    ffmpegDownscale.on("close", resolve);

    ffmpegDownscale.on("error", () => {
      console.error("Error occured extracting downscaled frames:", reject);
    });
  });
};
