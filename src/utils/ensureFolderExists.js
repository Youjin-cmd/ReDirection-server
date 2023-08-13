const fs = require("fs");

const ensureFolderExists = (path) => {
  try {
    fs.readdirSync(path);
  } catch (error) {
    console.error(`${path} doesn't exist. Creating...`);
    fs.mkdirSync(path);
  }
};

module.exports = ensureFolderExists;
