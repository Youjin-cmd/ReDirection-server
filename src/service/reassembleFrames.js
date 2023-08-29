const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const execFile = require("child_process").spawn;
const path = require("path");

const { ensureFolderExists } = require("../util/ensureFolderExists");
const { SAVING_DIR_RESULT, SAVING_DIR_AUDIO } = require("../constants/paths");

exports.reassembleFrames = async (targetFolder, type) => {
  ensureFolderExists(SAVING_DIR_RESULT);

  const ffmpegArgument = [
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
  ];

  if (type === "cropped") {
    ffmpegArgument.push("-i", path.join(SAVING_DIR_AUDIO, "audio.mp3"));
  }

  const ffmpegReassemble = execFile(ffmpegPath, ffmpegArgument);

  return new Promise((resolve, reject) => {
    ffmpegReassemble.stdout.on("data", (data) => {
      process.stdout.write(data.toString());
    });

    ffmpegReassemble.stderr.on("data", (data) => {
      process.stderr.write(data.toString());
    });

    ffmpegReassemble.on("close", () => {
      resolve(path.join(SAVING_DIR_RESULT, "result_video.mp4"));
    });

    ffmpegReassemble.on("error", () => {
      console.error("Error occured reassembling frames:", reject);
    });
  });
};
