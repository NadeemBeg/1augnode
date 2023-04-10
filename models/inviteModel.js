const mongoose = require("mongoose");

const InviteSchema = mongoose.Schema(
  {
    user: {
        type: String,
        required: false,
        default:null
    },
    inviteTo: {
        type: String,
        required: false,
        default:null
    },
    metamask: {
        type: String,
        required: false,
        default:null
    },
    invitationAccept:{
        type: Boolean,
        default: false,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invite", InviteSchema);
