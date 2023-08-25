const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const execFile = require("child_process").spawn;
const path = require("path");

const { ensureFolderExists } = require("../util/ensureFolderExists");
const { SAVING_DIR_AUDIO } = require("../constants/paths");

exports.extractAudio = async (file) => {
  ensureFolderExists(SAVING_DIR_AUDIO);

  const ffmpegAudio = execFile(ffmpegPath, [
    "-i",
    file.path,
    "-vn",
    "-ar",
    "44100",
    "-ac",
    "2",
    "-ab",
    "192k",
    "-f",
    "mp3",
    "-y",
    path.join(SAVING_DIR_AUDIO, "audio.mp3"),
  ]);

  return new Promise(
    (resolve) => {
      ffmpegAudio.stdout.on("data", (data) => {
        process.stdout.write(data.toString());
      });
      ffmpegAudio.stderr.on("data", (data) => {
        process.stderr.write(data.toString());
      });
      ffmpegAudio.on("close", resolve);
    },
    (reject) => {
      console.error("Error occured extracting audio:", reject);
      return false;
    },
  );
};
