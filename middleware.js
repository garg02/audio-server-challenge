const util = require("util");
const multer = require("multer");
const path = require('node:path');
const maxSize = 3 * 1024**2;

// store files on disk using multer middleware
let diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, directory + "/media/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

// ensure files are max 3MB and have appropriate extension
let wavFile = multer({
  storage: diskStorage,
  limits: {fileSize: maxSize},
  fileFilter: function (req, file, cb) {
    if (path.extname(file.originalname) !== '.wav') {
      return cb(new Error('Only wav files are allowed'))
    }
    cb(null, true)
  },
}).single("file");

let wavMiddle = util.promisify(wavFile);
module.exports = wavMiddle;