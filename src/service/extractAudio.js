const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const execFile = require("child_process").spawn;
const path = require("path");

const ensureFolderExists = require("../utils/ensureFolderExists");

const SAVING_DIR_AUDIO = path.join(__dirname, "../../audio");
ensureFolderExists(SAVING_DIR_AUDIO);

exports.extractAudio = async (file) => {
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
      ffmpegAudio.stdout.on("data", (x) => {
        process.stdout.write(x.toString());
      });
      ffmpegAudio.stderr.on("data", (x) => {
        process.stderr.write(x.toString());
      });
      ffmpegAudio.on("close", (code) => {
        resolve({ success: true, code });
        return true;
      });
    },
    (reject) => {
      console.error("Error occured extracting audio:", reject);
      return false;
    },
  );
};
