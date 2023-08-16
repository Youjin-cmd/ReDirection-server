const fs = require("fs");

exports.ensureFolderExists = (path) => {
  try {
    fs.readdirSync(path);
  } catch (error) {
    console.error(`${path} doesn't exist. Creating...`);
    fs.mkdirSync(path);
  }
};
