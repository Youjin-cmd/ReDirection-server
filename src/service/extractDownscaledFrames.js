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
    "10",
    "-pix_fmt",
    "pal8",
    "-y",
    path.join(SAVING_DIR_DOWNSCALED_FRAMES, "%01d.png"),
  ]);

  return new Promise(
    (resolve) => {
      ffmpegDownscale.stdout.on("data", (x) => {
        process.stdout.write(x.toString());
      });
      ffmpegDownscale.stderr.on("data", (x) => {
        process.stderr.write(x.toString());
      });
      ffmpegDownscale.on("close", resolve);
    },
    (reject) => {
      console.error("Error occured extracting downscaled frames:", reject);
      return false;
    },
  );
};
