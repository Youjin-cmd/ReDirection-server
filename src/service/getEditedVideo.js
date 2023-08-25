const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const execFile = require("child_process").spawn;
const path = require("path");

const {
  SAVING_DIR_RESULT,
  SAVING_DIR_EDITED_RESULT,
} = require("../constants/paths");
const { ensureFolderExists } = require("../util/ensureFolderExists");

exports.getEditedVideo = async (object, downloadedFiles) => {
  ensureFolderExists(SAVING_DIR_EDITED_RESULT);

  const {
    typeface,
    fontContent,
    fontX,
    fontY,
    fontWidth,
    fontColor,
    fontBg,
    stickerName,
    stickerX,
    stickerY,
  } = object;

  console.log(typeface, stickerName);

  const ffmpegArgument = [];

  if (typeface && !stickerName) {
    ffmpegArgument.push(
      "-i",
      path.join(SAVING_DIR_RESULT, "result_video.mp4"),
      "-vf",
      `drawtext=text="${fontContent}":x=${fontX}:y=${fontY}:fontsize=16:fontcolor=${fontColor}:fontfile=${downloadedFiles.typefacePath}:box=1:boxcolor=${fontBg}:boxborderw=${fontWidth}`,
    );
  }

  if (stickerName && !typeface) {
    ffmpegArgument.push(
      "-i",
      path.join(SAVING_DIR_RESULT, "result_video.mp4"),
      "-i",
      downloadedFiles.stickerPath,
      "-filter_complex",
      `[1:v]scale=150:-1[scaled_sticker];[0:v][scaled_sticker]overlay=x=${stickerX}:y=${stickerY}`,
    );
  }

  if (stickerName && typeface) {
    ffmpegArgument.push(
      "-i",
      downloadedFiles.stickerPath,
      "-i",
      path.join(SAVING_DIR_RESULT, "result_video.mp4"),
      "-vf",
      `drawtext=text="${fontContent}":x=${fontX}:y=${fontY}:fontsize=16:fontcolor=${fontColor}:fontfile=${downloadedFiles.typefacePath}:box=1:boxcolor=${fontBg},overlay=x=${stickerX}:y=${stickerY}`,
    );
  }

  ffmpegArgument.push(
    "-y",
    path.join(SAVING_DIR_EDITED_RESULT, "edited_video.mp4"),
  );

  console.log(ffmpegArgument);

  const ffmpegEditVideo = execFile(ffmpegPath, ffmpegArgument);

  return new Promise(
    (resolve) => {
      ffmpegEditVideo.stdout.on("data", (data) => {
        process.stdout.write(data.toString());
      });
      ffmpegEditVideo.stderr.on("data", (data) => {
        process.stderr.write(data.toString());
      });
      ffmpegEditVideo.on("close", () => {
        resolve(path.join(SAVING_DIR_EDITED_RESULT, "edited_video.mp4"));
      });
    },
    (reject) => {
      console.error("Error occured editing video:", reject);
      return false;
    },
  );
};
