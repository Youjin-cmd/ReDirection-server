const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const execFile = require("child_process").spawn;
const path = require("path");

exports.reassembleFrames = async (targetFolder) => {
  const ffmpegReassemble = execFile(ffmpegPath, [
    "-i",
    path.join(targetFolder, "%d.png"),
    "-c:v",
    "libx264",
    "-r",
    "25",
    "-pix_fmt",
    "yuv420p",
    "-y",
    path.join(targetFolder, "video_with_blended_frames.mp4"),
  ]);

  return new Promise(
    (resolve) => {
      ffmpegReassemble.stdout.on("data", (x) => {
        process.stdout.write(x.toString());
      });
      ffmpegReassemble.stderr.on("data", (x) => {
        process.stderr.write(x.toString());
      });
      ffmpegReassemble.on("close", (code) => {
        resolve(path.join(targetFolder, "video_with_blended_frames.mp4"));
      });
    },
    (reject) => {
      console.error("Error occured reassembling frames:", reject);
      return false;
    },
  );
};
