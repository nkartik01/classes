const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const admin = require("firebase-admin");
const fs = require("fs");
const auth_user = require("./auth_user");
router.post("/login", async (req, res) => {
  try {
    if (!req.body.roll || !req.body.password) {
      return res.status(400).send("Full details not sent");
    }
    var user = await admin
      .firestore()
      .collection("user")
      .doc(req.body.roll)
      .get();
    user = user.data();
    if (!user) {
      return res.status(400).send("User does not exist");
    }
    if (user.password !== req.body.password) {
      return res.status(400).send("Wrong password");
    }
    console.log(user, Date.now() + 120000);
    if (user.lastSession && user.lastSession < Date.now() + 120000) {
      user.lastSession = Date.now();
      console.log(user.lastSession);
      admin.firestore().collection("user").doc(req.body.roll).set(user);
      const payload = {
        iat: user.lastSession,
        user: {
          roll: req.body.roll,
        },
      };
      jwt.sign(payload, config.get("JWTSecretUser"), (err, token) => {
        if (err) throw err;
        return res.status(200).json({
          token: token,
        });
      });
    } else {
      return res.status(400).send("Please wait for 2 minutes");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/checkSession", auth_user, async (req, res) => {
  try {
    var user = await admin
      .firestore()
      .collection("user")
      .doc(req.user.roll)
      .get();
    user = user.data();
    if (user.lastSession > req.iat) {
      user.lastSession = Date.now();
      admin.firestore().collection("user").doc(req.user.roll).set(user);
      return res.status(400).send("Multiple Sessions Found");
    }

    res.send("hi");
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/video/:id", async (req, res) => {
  try {
    console.log(res.req.headers.referer);
    if (res.req.headers.referer !== "http://localhost:3000/") {
      console.log("err");
      return res.status(400).send("not accesible");
    }
    const path = "assets/" + req.params.id;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(path, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
