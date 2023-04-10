const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
      docUrl: { type: String, required: false },
      text_length: { type: Number, required: false },
      temp_file:{type: String, required: false, default:''},
      time:{type: Number, required: false, default:0},
      min:{type: Number, required: false, default:0},                 
      hours:{type: Number, required: false, default:0},                 

    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", MessageSchema);
