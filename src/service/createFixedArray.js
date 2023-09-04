const CreateError = require("http-errors");
const { NO_FRAME_EXISTS } = require("../constants/error");

exports.createFixedArray = async (leftEdge, filesNum, videoWidth) => {
  const fixedCoordArray = [];

  if (!filesNum) {
    throw CreateError(400, NO_FRAME_EXISTS);
  }

  for (let i = 0; i < filesNum * 2 + 1; i++) {
    if (i % 26 === 0) {
      continue;
    }

    fixedCoordArray.push(Math.round((leftEdge / 1000) * videoWidth) * 10);
  }

  return fixedCoordArray;
};
