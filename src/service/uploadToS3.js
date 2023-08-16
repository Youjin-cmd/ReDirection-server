const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const config = require("../constants/config");

const s3Client = new S3Client({
  region: config.AWS_S3_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

exports.uploadToS3 = async (file) => {
  const fileStream = fs.createReadStream(file.path);

  const bucketName = config.AWS_BUCKET_NAME;
  const key = "analysis_video/video.mp4";

  const uploadParams = {
    Bucket: bucketName,
    Key: key,
    Body: fileStream,
  };

  try {
    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3Client.send(uploadCommand);
    return `https://${bucketName}.s3.ap-northeast-2.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
