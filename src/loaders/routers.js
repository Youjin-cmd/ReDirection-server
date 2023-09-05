const videoRouter = require("../routes/video");

async function routerLoader(app) {
  app.get("/", (req, res) => {
    res.status(200).send({ success: true });
  });
  app.use("/video", videoRouter);
}

module.exports = routerLoader;
