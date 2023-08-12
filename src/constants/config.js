require("dotenv").config();

const CONFIG = {
  PORT: process.env.PORT,
  CLIENT_URL: process.env.CLIENT_URL,
};

module.exports = CONFIG;
