/* eslint-disable prettier/prettier */
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const execFile = require("child_process").spawn;
const path = require("path");

const {
  SAVING_DIR_RESULT,
  SAVING_DIR_EDITED_RESULT,
} = require("../constants/paths");
const { ensureFolderExists } = require("../util/ensureFolderExists");

exports.getEditedVideo = async (selectedDecos, downloadedFiles) => {
  ensureFolderExists(SAVING_DIR_EDITED_RESULT);

  const { font, sticker } = selectedDecos;
  const { X, Y, fontContent, fontBg, fontWidth, fontColor } = font;

  const ffmpegArgument = [];

  if (font && !sticker && fontBg === "transparent") {
    ffmpegArgument.push(
      "-i",
      path.join(SAVING_DIR_RESULT, "result_video.mp4"),
      "-vf",
      `drawtext=text=${fontContent}:x=(406-text_w)/2:y=${Y}:fontsize=30:fontcolor=${fontColor}:fontfile=${downloadedFiles.font.path}`,
    );
  }

  if (font && !sticker && fontBg !== "transparent") {
    ffmpegArgument.push(
      "-i",
      path.join(SAVING_DIR_RESULT, "result_video.mp4"),
      "-vf",
      `drawbox=x=${X}:y=${Y - 4}:w=${fontWidth}:h=35:color=${fontBg}:t=fill,drawtext=text=${fontContent}:x=(406-text_w)/2:y=${Y}:fontsize=30:fontcolor=${fontColor}:fontfile=${downloadedFiles.font.path}`,
    );
  }

  if (sticker && !font) {
    ffmpegArgument.push(
      "-i",
      path.join(SAVING_DIR_RESULT, "result_video.mp4"),
      "-i",
      downloadedFiles.sticker.path,
      "-filter_complex",
      `[1:v]scale=150:-1[scaled_sticker];[0:v][scaled_sticker]overlay=x=${sticker.X}:y=${sticker.Y}`,
    );
  }

  if (sticker && font && fontBg === "transparent") {
    ffmpegArgument.push(
      "-i",
      path.join(SAVING_DIR_RESULT, "result_video.mp4"),
      "-i",
      downloadedFiles.sticker.path,
      "-filter_complex",
      `[1:v]scale=150:-1[scaled_sticker];[0:v][scaled_sticker]overlay=x=${sticker.X}:y=${sticker.Y},drawtext=text=${fontContent}:x=${X}+${fontWidth}/2-text_w/2:y=${Y}:fontsize=30:fontcolor=${fontColor}:fontfile=${downloadedFiles.font.path}`,
    );
  }

  if (sticker && font && fontBg !== "transparent") {
    ffmpegArgument.push(
      "-i",
      path.join(SAVING_DIR_RESULT, "result_video.mp4"),
      "-i",
      downloadedFiles.sticker.path,
      "-filter_complex",
      `[1:v]scale=150:-1[scaled_sticker];[0:v][scaled_sticker]overlay=x=${sticker.X}:y=${sticker.Y},drawbox=x=${X}:y=${Y - 7}:w=${fontWidth}:h=35:color=${fontBg}:t=fill,drawtext=text=${fontContent}:x=${X}+${fontWidth}/2-text_w/2:y=${Y}:fontsize=30:fontcolor=${fontColor}:fontfile=${downloadedFiles.font.path}`,
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
