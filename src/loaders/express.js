const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const CONFIG = require("../constants/config");

async function expressLoader(app) {
  app.use(
    cors({
      origin: CONFIG.CLIENT_URL,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ extended: false, limit: "100mb" }));
  app.use(cookieParser());
}

module.exports = expressLoader;
