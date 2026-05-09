const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Compression des images
const optiImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }
  
  // Chemin du fichier d'origine
  const uploadRoot = path.resolve(req.file.destination);
  const imagePath = path.resolve(uploadRoot, req.file.path);
  // changement de nom du fichier
  const fileName = req.file.filename.split('.')[0];
  const compressedFileName = `${fileName}${Date.now()}.webp`;

  // Nouveau chemin pour l'image compressée
  const compressedImagePath = path.resolve(uploadRoot, compressedFileName);
  const imagePathRelative = path.relative(uploadRoot, imagePath);
  const compressedPathRelative = path.relative(uploadRoot, compressedImagePath);
  if (
    imagePathRelative.startsWith("..") ||
    path.isAbsolute(imagePathRelative) ||
    compressedPathRelative.startsWith("..") ||
    path.isAbsolute(compressedPathRelative)
  ) {
    return res.status(400).json({ error: "Chemin de fichier invalide" });
  }

  // Compression de l'image
  sharp(imagePath)
    .resize(352, 568, {
      fit: 'fill'})
    .webp()
    .toFile(compressedImagePath, (error) => {
      if (error) {
        return res.status(500).json({ error: "Erreur pendant la compression de l'images" });
      };

      // Maj de l'image, nouveau chemin et nom
      req.file.filename = compressedFileName;
      req.file.path = compressedImagePath;

      // Suppression de l'ancien fichier
      fs.unlinkSync(imagePath);
      
      next();
    });
};

module.exports = optiImage;