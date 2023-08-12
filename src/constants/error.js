const ERROR_PATTERNS = {
  PAGE_NOT_FOUND: {
    status: 404,
    message: "Page Is Not Found",
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "Internal Server Error",
  },
  BAD_REQUEST: {
    status: 400,
    message: "Bad Request",
  },
};

module.exports = ERROR_PATTERNS;
