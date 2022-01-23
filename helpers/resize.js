const sharp = require('sharp');

const resize = async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];
  await Promise.all(
    req.files.map(async (file) => {
      const filename = file.originalname.replace(/\..+$/, '');
      const newFilename = `${filename}-${Date.now()}.jpeg`;

      await sharp(file.buffer)
        .resize(640, 320)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`${__dirname}/../public/images/${newFilename}`);

      req.body.images.push(newFilename);
    })
  );

  next();
};
module.exports = { resize };
