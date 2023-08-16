require("dotenv").config();

const CONFIG = {
  PORT: process.env.PORT,
  CLIENT_URL: process.env.CLIENT_URL,
  AWS_S3_REGION: process.env.AWS_S3_REGION,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
};

module.exports = CONFIG;
