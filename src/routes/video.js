const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.send({ success: true });
});

module.exports = router;
