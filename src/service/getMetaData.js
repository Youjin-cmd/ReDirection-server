const CreateError = require("http-errors");

const {
  ALREADY_VERTICAL,
  RATIO_NOT_SUPPORTED,
  TOO_LONG_OR_SHORT,
} = require("../constants/error");

const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const execFile = require("child_process").spawn;

exports.getMetaData = async (file) => {
  const ffprobeGetMetaData = execFile(ffprobePath, [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height",
    "-show_entries",
    "format=duration",
    "-of",
    "json",
    file.path,
  ]);

  let outputData = "";

  return new Promise((resolve, reject) => {
    ffprobeGetMetaData.stdout.on("data", (data) => {
      process.stdout.write(data.toString());
      outputData += data.toString();
    });

    ffprobeGetMetaData.stderr.on("data", (data) => {
      process.stderr.write(data.toString());
    });

    ffprobeGetMetaData.on("close", () => {
      const metadata = JSON.parse(outputData);

      const durationInSeconds = metadata.format.duration;
      const width = metadata.streams[0].width;
      const height = metadata.streams[0].height;

      if (width < height) {
        const error = new CreateError(400, ALREADY_VERTICAL);

        reject(error);
      }

      if (width / height <= 1.5) {
        const error = new CreateError(400, RATIO_NOT_SUPPORTED);

        reject(error);
      }

      if (durationInSeconds > 60 || durationInSeconds < 5) {
        const error = new CreateError(400, TOO_LONG_OR_SHORT);

        reject(error);
      }

      resolve(width);
    });

    ffprobeGetMetaData.stderr.on("error", () => {
      console.error("Error occurred while executing ffprobe:", reject);
    });
  });
};
