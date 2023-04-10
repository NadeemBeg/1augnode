const {login,register} = require("../controllers/admin/admin");
const {save,get,deleteTemplate} = require("../controllers/admin/Template");
const {verifyAuth} = require('../middleware/auth');

const router = require("express").Router();
  
router.post("/login", login);
router.post("/register", register);
router.post("/template/save",verifyAuth, save);
router.post("/template/get",verifyAuth, get);
router.post("/template/delete",verifyAuth, deleteTemplate);

module.exports = router;
  