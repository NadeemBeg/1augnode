const { saveFile,compressFile,saveLargeFile} = require("../controllers/fileSave");
const router = require("express").Router();

router.post("/saveFile", saveFile);
router.post("/compressFile", compressFile);
router.post("/saveLargeFile", saveLargeFile);




module.exports = router;
