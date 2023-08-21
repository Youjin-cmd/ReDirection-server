const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const execFile = require("child_process").spawn;
const path = require("path");

const { ensureFolderExists } = require("../util/ensureFolderExists");
const { SAVING_DIR_RESULT } = require("../constants/paths");

exports.reassembleFrames = async (targetFolder) => {
  ensureFolderExists(SAVING_DIR_RESULT);

  const ffmpegReassemble = execFile(ffmpegPath, [
    "-i",
    path.join(targetFolder, "%01d.png"),
    "-c:v",
    "libx264",
    "-r",
    "25",
    "-pix_fmt",
    "yuv420p",
    "-y",
    path.join(SAVING_DIR_RESULT, "result_video.mp4"),
  ]);

  return new Promise(
    (resolve) => {
      ffmpegReassemble.stdout.on("data", (x) => {
        process.stdout.write(x.toString());
      });
      ffmpegReassemble.stderr.on("data", (x) => {
        process.stderr.write(x.toString());
      });
      ffmpegReassemble.on("close", () => {
        resolve(path.join(SAVING_DIR_RESULT, "result_video.mp4"));
      });
    },
    (reject) => {
      console.error("Error occured reassembling frames:", reject);
      return false;
    },
  );
};
