const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const fileRoutes = require('./routes/fileSave');
const sendEmailRoutes = require('./routes/sendEmail');
const admin = require("./routes/admin");
const invite = require("./routes/invite");
const app = express();
const socket = require("socket.io");
require("dotenv").config();
const fileUpload = require('express-fileupload');
const Messages = require("./models/messageModel");
const fireBase = require('./helper/fireStoragedetails');
var bodyParser = require('body-parser');
const cron = require("node-cron");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); 
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(fileUpload());

mongoose
  .connect("mongodb+srv://nadeembeg:wCcdYeqtCM0Pw0tv@desoapp.5y4enph.mongodb.net/wallet-chat?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/document", fileRoutes);
app.use("/api/email", sendEmailRoutes);
app.use("/api/admin", admin);
app.use("/api/invite",invite);

const server = app.listen(5005, () =>
  console.log(`Server started on ${5005}`)
);

global.onlineUsers = new Map();
const io = socket(server, {
  cors: {
    // origin: "http://localhost:3000",
    // origin:"https://wallet.aarchik.com/",
    // credentials: true,
    origin: '*',

    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE'
    ],

    allowedHeaders: [
      'Content-Type',
    ],
  },
});

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE'
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
    '*'
  ],
};

app.use(cors(corsOpts));

const getApiAndEmit = async(socket) => {
  console.log('enter');
  Messages.find({"message.text": { '$regex' : ".ipfs.nftstorage.link", '$options' : 'i' } }, async(err,data)=>{
    if(data){
        for(let msg of data){
          if(msg.message.min && msg.message.min != '0'){ 
            let a = new Date(msg.createdAt);
            let b = msg.message.min; 
            let deleteminute = new Date(a.getTime() + b*60000);
            console.log(new Date(),'new date');          
            console.log(deleteminute,'delete date');          
  
            if(new Date() > deleteminute){
              console.log('enter to file delete');
              if(msg.message.temp_file){
                await fireBase.deleteImageToStorage(msg.message.temp_file);
              }
              console.log('delete file');
              await Messages.deleteOne({_id:msg._id});
              const sendUserSocket = onlineUsers.get(msg.users[1]);
              // const sendUserSocket = msg.users[1];
              console.log(sendUserSocket,'sendUserSocket first');
              if (sendUserSocket) {
                var newObje ={
                  to:msg.users[1],
                  from:msg.users[0],
                  msg:msg.message.text,
                  is_delete: true
                }
                socket.to(sendUserSocket).emit("msg-recieve", newObje);
              }
              const sendUserSockets = onlineUsers.get(msg.users[0]);
              // const sendUserSockets = msg.users[0];
              console.log(sendUserSockets,'sendUserSockets second');
              if (sendUserSockets) {
                var newObje ={
                  to:msg.users[1],
                  from:msg.users[0],
                  msg:msg.message.text,
                  is_delete: true
                }
                socket.to(sendUserSockets).emit("msg-recieve", newObje);
              }
            }
          }
          else{
            if(msg.message.hours && msg.message.hours != '0'){
              if(diffHours >= msg.message.hours){
                console.log("diffHoursdiffHours",diffHours,msg.message.hours);
                if(msg.message.temp_file !== '0' && !msg.message.temp_file){
                  await fireBase.deleteImageToStorage(msg.message.temp_file);
                }
                await Messages.deleteOne({_id:msg._id});
              }
            }
          }
        }      
    }
  });
  
};

io.on("connection", (socket) => {
  let interval;
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  interval = setInterval(async() =>{
    // console.log("testing 1.5");
   await getApiAndEmit(socket)}, 30000);
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    console.log("sendUserSocket send-msg",sendUserSocket);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data);
    }
  });
  socket.on("delete-msg", (data) => {
    console.log("delete-msg",data);
    const sendUserSocket = onlineUsers.get(data.to);
    console.log("sendUserSocket send-msg",sendUserSocket);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data);
    }
  });

});
