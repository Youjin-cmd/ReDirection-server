const createError = require("http-errors");

async function errorHandlerLoader(app) {
  app.use((req, res, next) => {
    next(createError(404));
  });

  app.use((error, req, res, next) => {
    res.locals.message = error.message;
    res.locals.error = req.app.get("env") === "development" ? error : {};

    res.status(error.status || 500);
    res.json({ customMessage: error.message });

    next(error);
  });
}

module.exports = errorHandlerLoader;
