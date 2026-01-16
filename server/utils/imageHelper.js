const fs = require("fs");
const createUploadFolder = () => {
  const dir = "./uploads";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    console.log("Uploaded folder created");
  }
};

module.exports = { createUploadFolder };
