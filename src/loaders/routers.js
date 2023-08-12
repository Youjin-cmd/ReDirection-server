const videoRouter = require("../routes/video");

async function routerLoader(app) {
  app.use("/video", videoRouter);
}

module.exports = routerLoader;
