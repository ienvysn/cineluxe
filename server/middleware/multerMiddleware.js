const multer = require("multer");

const upload = multer({
  storage,
  fileFilter,
  limits: { filwSize: 1024 * 1024 * 5 },
});

export default upload;
