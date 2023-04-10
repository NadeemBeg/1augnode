const Invite = require("../models/inviteModel");
const User = require("../models/userModel");

module.exports.inviteUser = async (req, res, next) => {
    try {
      const { user, inviteTo, metamask } = req.body;
      console.log();
      const craeteInvitaion = await Invite.create({
        user, inviteTo, metamask
      });
      if(craeteInvitaion){
        return res.json({ status: true, craeteInvitaion });
      }
    }
    catch (ex) {
        next(ex);
    }
}

module.exports.invitationShow = async (req, res, next) => {
    try {
      const { user } = req.body;
      console.log();
      const receiveInvitaion = await Invite.find({ inviteTo:user });
      const sendInvitaion = await Invite.find({ user:user });

      if(receiveInvitaion){
        return res.json({ status: true, receiveInvitaion, sendInvitaion});
      }
      else{
        return res.json({ status: false, msg:"Something Want Wrong" });
      }
    }
    catch (ex) {
        next(ex);
    }
}
