const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const config = require("../constants/config");
const fs = require("fs").promises;
const path = require("path");
const { SAVING_DIR_EDITED_RESULT } = require("../constants/paths");

const s3Client = new S3Client({
  region: config.AWS_S3_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

exports.downloadIngredients = async (object) => {
  const { typeface, stickerName } = object;
  const bucketName = config.AWS_BUCKET_NAME;

  const results = {};

  try {
    if (typeface) {
      const downloadParams = {
        Bucket: bucketName,
        Key: `fonts/${typeface}.ttf`,
      };

      const downloadCommand = new GetObjectCommand(downloadParams);
      const data = await s3Client.send(downloadCommand);

      const localPath = path.join(SAVING_DIR_EDITED_RESULT, `${typeface}.ttf`);
      await fs.writeFile(localPath, data.Body);

      results.typefacePath = localPath;
    }

    if (stickerName) {
      const downloadParams = {
        Bucket: bucketName,
        Key: `stickers/${stickerName}.png`,
      };

      const downloadCommand = new GetObjectCommand(downloadParams);
      const data = await s3Client.send(downloadCommand);

      const localPath = path.join(
        SAVING_DIR_EDITED_RESULT,
        `${stickerName}.png`,
      );
      await fs.writeFile(localPath, data.Body);

      results.stickerPath = localPath;
    }

    return results;
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};
