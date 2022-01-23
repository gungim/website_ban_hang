const multer = require('multer');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb('Please upload only images.', false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

const uploadFiles = upload.array('images', 10);

const uploadImages = (req, res, next) => {
    uploadFiles(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.send('Too many files to upload.');
            }
        } else if (err) {
            return res.send(err);
        }

        next();
    });
};

module.exports = { uploadImages };
