const { inviteUser,invitationShow} = require("../controllers/inviteController");
const router = require("express").Router();

router.post("/inviteUser", inviteUser);
// router.post("/inviteAccept", inviteAccept);
router.post("/invitationShow", invitationShow);


module.exports = router;