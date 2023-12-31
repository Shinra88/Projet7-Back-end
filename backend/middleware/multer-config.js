const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/tiff": "tiff",
  "image/svg+xml": "svg"
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// Gestion des téléchargements
module.exports = (req, res, next) => {
  const upload = multer({ storage }).single("image");
  upload(req, res, (error) => {
    if (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    } else {
      next();
    }
  });
};

module.exports = multer({storage: storage}).single("image");