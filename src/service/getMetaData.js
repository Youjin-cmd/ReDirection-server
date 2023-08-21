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
    "-of",
    "json",
    file.path,
  ]);

  let outputData = "";

  return new Promise(
    (resolve) => {
      ffprobeGetMetaData.stdout.on("data", (data) => {
        process.stdout.write(data.toString());
        outputData += data.toString();
      });
      ffprobeGetMetaData.stderr.on("data", (data) => {
        process.stderr.write(data.toString());
      });
      ffprobeGetMetaData.on("close", () => {
        const metadata = JSON.parse(outputData);
        resolve(metadata.streams[0].width);
      });
    },
    (reject) => {
      console.error("Error occured extracting original frames:", reject);
      return false;
    },
  );
};
