const multer = require("multer");
const path = require("path");

const useruploading = () => {
    const userStorage = multer.diskStorage({
            destination: function (req, file, cb) {
                if(file.fieldname === "image"){
                    console.log("the file is uploaded (image)");
                cb(null, "Uploads-image");
                }else{
                console.log("the file is uploaded (pdf)");
                cb(null, "Uploads-transcript/");
                }
            },
            filename: function (req, file, cb) {
                const extantion = path.extname(file.originalname);
                const uniqueString =
                    file.fieldname + "-" + Date.now() + extantion;
                cb(null, uniqueString);
            },
        });
        const multerFilter = function (req, file, cb) {
            if (file.mimetype === "application/pdf" || 
            file.mimetype === "image/png" || 
            file.mimetype === "image/jpg" || 
            file.mimetype === "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false);
            }
        };
        const uploading = multer({
            storage: userStorage,
            fileFilter: multerFilter,
        });
        return uploading;

};
module.exports = useruploading;
