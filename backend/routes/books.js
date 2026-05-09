const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const optiImage = require("../middleware/opti-Image");
const booksCtrl = require("../controllers/books");

const ratingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 rating requests per window
});

const deleteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 delete requests per window
});

router.get("/", booksCtrl.getAllBook);
router.post("/", auth, multer, optiImage, booksCtrl.createBook);
router.get("/bestrating", booksCtrl.getBestBooks);
router.get("/:id", booksCtrl.getOneBook);
router.put("/:id", auth, multer, optiImage, booksCtrl.modifyBook);
router.delete("/:id", deleteLimiter, auth, booksCtrl.deleteBook);
router.post("/:id/rating", ratingLimiter, auth, booksCtrl.postBookRating);


module.exports = router;