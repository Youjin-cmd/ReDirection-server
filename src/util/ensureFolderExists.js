const fs = require("fs");

exports.ensureFolderExists = (path) => {
  try {
    fs.readdirSync(path).forEach((file) => {
      const filePath = path + "/" + file;
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error(`${path} doesn't exist. Creating...`);
    fs.mkdirSync(path, { recursive: true });
  }
};
