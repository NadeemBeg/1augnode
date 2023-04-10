const mongoose = require("mongoose");

const templateDataSchema = mongoose.Schema(
  {
    template_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "template",
      required: true,
    },
    is_name: {
        type: Boolean,
        default: false,
    },
    is_course: {
        type: Boolean,
        default: false,
    },
    is_score: {
        type: Boolean,
        default: false,
    },
    is_sinature: {
        type: Boolean,
        default: false,
    },
    is_date: {
        type: Boolean,
        default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("templateData", templateDataSchema);