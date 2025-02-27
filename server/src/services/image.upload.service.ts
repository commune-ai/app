import fs from "fs";
import path from "path";
import multer from "multer";

const Imagestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../../uploads/images");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

const imageUpload = multer({
    limits: { fileSize: 1 * 1024 * 1024 }, storage: Imagestorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
            cb(null, true);
        } else {
            cb(new Error("Only .jpeg,.jpg and .png files are allowed with image size of 1MB"));
        }
    },
});


export { imageUpload };