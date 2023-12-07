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

  const ffmpegArgument = [];

  ffmpegArgument.push(
    "-i",
    path.join(SAVING_DIR_RESULT, "result_video.mp4"),
  );

  if (sticker) {
    ffmpegArgument.push(
      "-i",
      downloadedFiles.sticker.path,
      "-filter_complex",
      `[1:v]scale=150:-1[scaled_sticker];[0:v][scaled_sticker]overlay=x=${sticker.X}:y=${sticker.Y},`,
    );
  }

  if (!sticker) {
    ffmpegArgument.push(
      "-vf",
      "",
    )
  }

  if (font && font.fontBg !== "transparent") {
    ffmpegArgument[ffmpegArgument.length - 1] += `drawbox=x=${font.X}:y=${font.Y - 4}:w=${font.fontWidth}:h=35:color=${font.fontBg}:t=fill,`;
  }

  if (font) {
    ffmpegArgument[ffmpegArgument.length - 1] += `drawtext=text=${font.fontContent}:x=${font.X}+${font.fontWidth}/2-text_w/2:y=${font.Y}:fontsize=30:fontcolor=${font.fontColor}:fontfile=${downloadedFiles.font.path}`;
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
