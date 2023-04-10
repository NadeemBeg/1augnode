const Messages = require("../models/messageModel");
const axios = require('axios');
const Formidable = require("formidable"); //Meant for body parsing
const fireBase = require('../helper/fireStoragedetails');

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    // }).sort({ $natural : -1 });
    }).sort({ updatedAt: 1 });
    const projectedMessages = messages.map((msg) => {
      let resData = {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        createdAt: msg.createdAt,
        id:msg._id
      };
      if (msg.message.text_length) {
        resData.text_length = msg.message.text_length;
      }
      if (msg.message.docUrl) {
        resData.docUrl = msg.message.docUrl;
      }
      if (msg.message.temp_file) {
        resData.temp_file = msg.message.temp_file;
      }
      if (msg.message.fileObject) {
        resData.fileObject = msg.message.fileObject;
      }
      return resData;
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    console.log("req.body",req.body);
    const { from, to, message, text_length, docUrl,min,hours} = req.body;
    var {temp_file} =req.body;
    console.log("temp_file",temp_file);
    var {time} = req.body;
    if(!temp_file){
      temp_file = null
    }
    else{
      if(min == 0){
        if(hours == 0){
          return res.json({ msg: "Please Select The Time" });
        }
      }
    }
    if(!time){
      time = 0
    }

    const data = await Messages.create({
      message: { text: message, docUrl:docUrl, text_length,temp_file:temp_file, time:time,min:min,hours:hours },
      users: [from, to],
      sender: from,
    });
    if(data){
      return res.json({ msg: "Message added successfully.",data: data})
    }
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getFirebaseMsg = async (req, res, next) => {
  console.log("url",req.body.url);
  const {url} = req.body;
  Messages.findOne({"message.text": url }, async(err,data)=>{
    console.log("err",err);
    if(data){
      console.log("Data",data);
      if(data.message.temp_file !== '0' && !data.message.temp_file){
        await fireBase.deleteImageToStorage(data.message.temp_file);
      }
      await Messages.deleteOne({_id:data._id});
      return res.json({ msg: "File successfully deleted."})
    }
    else{
      return res.json({ msg: "File not deleted."})
      
    }

  });
}