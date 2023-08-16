const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const execFile = require("child_process").spawn;
const path = require("path");

const ensureFolderExists = require("../utils/ensureFolderExists");

const SAVING_DIR_DOWNSCALE = path.join(__dirname, "../../downscale");

ensureFolderExists(SAVING_DIR_DOWNSCALE);

exports.extractDownscaledFrames = async (file) => {
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
    path.join(SAVING_DIR_DOWNSCALE, "%01d.png"),
  ]);

  return new Promise(
    (resolve) => {
      ffmpegDownscale.stdout.on("data", (x) => {
        process.stdout.write(x.toString());
      });
      ffmpegDownscale.stderr.on("data", (x) => {
        process.stderr.write(x.toString());
      });
      ffmpegDownscale.on("close", (code) => {
        resolve({ success: true, code });
        return true;
      });
    },
    (reject) => {
      console.error("Error occured extracting downscaled frames:", reject);
      return false;
    },
  );
};
