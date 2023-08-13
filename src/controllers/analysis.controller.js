const CreateError = require("http-errors");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const execFile = require("child_process").spawn;
const path = require("path");

const ensureFolderExists = require("../utils/ensureFolderExists");
const { UPLOAD_FAILED } = require("../constants/error");

exports.analyzeVideo = async (req, res) => {
  if (!req.file) {
    throw CreateError(400, UPLOAD_FAILED);
  }

  const SAVING_DIR_DOWNSCALE = path.join(__dirname, "../../downscale");
  const SAVING_DIR_AUDIO = path.join(__dirname, "../../audio");

  ensureFolderExists(SAVING_DIR_DOWNSCALE);
  ensureFolderExists(SAVING_DIR_AUDIO);

  const ffmpegDownscale = execFile(ffmpegPath, [
    "-i",
    req.file.path,
    "-vf",
    "scale=50:-1",
    "-r",
    "10",
    "-y",
    path.join(SAVING_DIR_DOWNSCALE, "%04d.png"),
  ]);

  const ffmpegAudio = execFile(ffmpegPath, [
    "-i",
    req.file.path,
    "-vn",
    "-ar",
    "44100",
    "-ac",
    "2",
    "-ab",
    "192k",
    "-f",
    "mp3",
    path.join(SAVING_DIR_AUDIO, "audio.mp3"),
  ]);

  const downscalePromise = new Promise(
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

  const audioPromise = new Promise(
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

  try {
    await Promise.all([downscalePromise, audioPromise]);
    return { success: true };
  } catch (error) {
    console.error("Something went wrong:", error);
    return { success: false, error };
  }
};
