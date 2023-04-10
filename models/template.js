const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
    title: {
        type: String,
        default:null
    },
    sub_title: {
        type: String,
        default:null
    },
    comment: {
        type: String,
        default:null
    },
    bg_img: {
        type: String,
        default:null
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model("template", templateSchema);
