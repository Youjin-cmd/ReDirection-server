/* eslint-disable prettier/prettier */
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

  const ffmpegArgument = [];

  if (typeface && !stickerName) {
    ffmpegArgument.push(
      "-i",
      path.join(SAVING_DIR_RESULT, "result_video.mp4"),
      "-vf",
      `drawbox=x=${fontX}:y=${fontY - 4}:w=${fontWidth}:h=35:color=${fontBg}:t=fill,drawtext=text=${fontContent}:x=(406-text_w)/2:y=${fontY}:fontsize=30:fontcolor=${fontColor}:fontfile=${downloadedFiles.typefacePath}`,
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
      path.join(SAVING_DIR_RESULT, "result_video.mp4"),
      "-i",
      downloadedFiles.stickerPath,
      "-filter_complex",
      `[1:v]scale=150:-1[scaled_sticker];[0:v][scaled_sticker]overlay=x=${stickerX}:y=${stickerY},drawbox=x=${fontX}:y=${fontY - 7}:w=${fontWidth}:h=35:color=${fontBg}:t=fill,drawtext=text=${fontContent}:x=${fontX}+${fontWidth}/2-text_w/2:y=${fontY}:fontsize=30:fontcolor=${fontColor}:fontfile=${downloadedFiles.typefacePath}`,
    );
  }

  ffmpegArgument.push(
    "-y",
    path.join(SAVING_DIR_EDITED_RESULT, "edited_video.mp4"),
  );

  const ffmpegEditVideo = execFile(ffmpegPath, ffmpegArgument);

  return new Promise(
    (resolve, reject) => {
      ffmpegEditVideo.stdout.on("data", (data) => {
        process.stdout.write(data.toString());
      });

      ffmpegEditVideo.stderr.on("data", (data) => {
        process.stderr.write(data.toString());
      });

      ffmpegEditVideo.on("close", () => {
        resolve(path.join(SAVING_DIR_EDITED_RESULT, "edited_video.mp4"));
      });

      ffmpegEditVideo.on("error", () => {
        console.error("Error occured editing video:", reject);
      });
    },
  );
};
