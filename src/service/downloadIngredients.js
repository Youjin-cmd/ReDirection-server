const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const config = require("../constants/config");
const fs = require("fs").promises;
const path = require("path");
const { SAVING_DIR_INGREDIENTS } = require("../constants/paths");
const { ensureFolderExists } = require("../util/ensureFolderExists");

const s3Client = new S3Client({
  region: config.AWS_S3_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

exports.downloadIngredients = async (selectedSquares) => {
  ensureFolderExists(SAVING_DIR_INGREDIENTS);
  const bucketName = config.AWS_BUCKET_NAME;

  const result = {};

  const ext = {
    font: "ttf",
    sticker: "png",
  }

  try {
    for (const element in selectedSquares) {
      const downloadParams = {
        Bucket: bucketName,
        Key: `${element}s/${selectedSquares[element].name}.${ext[element]}`,
      };

      const downloadCommand = new GetObjectCommand(downloadParams);
      const data = await s3Client.send(downloadCommand);

      const localPath = path.join(SAVING_DIR_INGREDIENTS, `${selectedSquares[element].name}.${ext[element]}`);
      await fs.writeFile(localPath, data.Body);

      result[element] = { path: localPath };
    }
  } catch (error) {
    console.error("Error downloading file:", error);
  }

  return result;
};
