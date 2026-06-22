const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require("path");

const s3Config = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// File filter (chỉ cho jpg, jpeg, png, webp)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|avif/;
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép file .jpg, .jpeg, .png, .avif và .webp"));
  }
};

const upload = multer({
  storage: multerS3({
    s3: s3Config,
    bucket: process.env.R2_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, "avatar/" + uniqueName + ext);
    },
  }),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;
