const fireBase = require('../helper/fireStoragedetails');
const ffmpeg=  require('fluent-ffmpeg');
var CryptoJS = require("crypto-js");
const axios = require('axios');
const fetch = require('node-fetch');
var fs = require('fs');

const { isBuffer } = require('util');
module.exports.saveFile = async (req, res, next) => {
  try {
    // var fileName = req.files.file.name;
    console.log("req.files",req.files.name);
    var url
    if (req.files != undefined) {
        var url = await fireBase.uploadImageToStorage('tempFileSave',req.files.name);
        console.log("url",url);
      }

    return res.json(url);
  } catch (ex) {
    next(ex);
  }
};
module.exports.saveLargeFile = async (req, res, next) => {
  try {
    const FormData = require('form-data');
    const crypto = require('crypto');
    const { Readable } = require("stream");
    console.log("req.files",req.files.file);
    const JWT = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyOTRiNTViMS0zMDE4LTRjODYtOTNkZC1iMWNlOGQ3MTE0MTUiLCJlbWFpbCI6Im5pbGVzaC5wQGFhcmNoaWsuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjgxYTI3M2VlZGJiOGVjMjg5Y2ZjIiwic2NvcGVkS2V5U2VjcmV0IjoiNTczMWUzMDc1NTQxYzA4YzBkOWMxMDliMTJlNDdmNzg3MTBmMWI5MzA3ZjdkOTc5N2M1MjZiYjg5N2MwNGNjNyIsImlhdCI6MTY3ODMzNjcyOH0.QsatOr00SyaJQJ-R-AnwueSEnSgYuAdXJh3qhv739SI';
    var stream = Buffer.from(req.files.file.data);
    stream = stream.toString();
    // console.log(stream,"stream");
    stream = JSON.stringify(stream);

    const algorithm = 'aes-256-cbc';
                    
    const key = crypto.randomBytes(32);
    console.log("key",key);
    let iv = crypto.randomBytes(16);
    // return;
    async function encrypt(text) {
        let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex') };
    }
    // var encrypted = await encrypt(stream);
    // console.log(encrypted,"encryptedData");

    //decrytp
    // function decrypt(text) {
    //   iv = Buffer.from(text.iv, 'hex');
    //   let encryptedText = Buffer.from(text.encryptedData, 'hex');
   
    //   let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
   
    //   let decrypted = decipher.update(encryptedText);
    //   decrypted = Buffer.concat([decrypted, decipher.final()]);
    //   return decrypted;
    // }
    
    // const decrypted = decrypt(encrypted)
    // // console.log("decrypted",decrypted);
    // let pdfdata = Buffer.from(decrypted).toString();
    // console.log("pdfdata",pdfdata);
    // const mimeType = 'image/png'; 
    // let file = fs.createWriteStream(`./ndm.jpg`);
    // file.write(pdfdata);
    // file.close();
    // return;


    // const data = new FormData();
    // data.append('file', encrypted.encryptedData, {
    //   filepath: `${req.files.file.name}`
    // });
    // // console.log(data._boundary,"data._boundary");
    // const responce = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
    //   maxBodyLength: "Infinity",
    //   headers: {
    //       'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
    //       Authorization: JWT
    //   }
    // });
    // console.log("responce",responce);


    // if(responce.data.IpfsHash){
      setTimeout(async() => {
          let responce1 = await fetch(`https://gateway.pinata.cloud/ipfs/QmQ8ymeYJCahXvpUPEvRcNs1YpuHTF63yLymK2RMWtcX2w`).then(async(data) =>{
              console.log("data --->",data);
              function decrypt(text) {
                iv = Buffer.from(iv, 'hex');
                console.log("iv",iv);
                let encryptedText = Buffer.from(text, 'hex');
                console.log("encryptedText",encryptedText);
                let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
                let decrypted = decipher.update(encryptedText);
                decrypted = Buffer.concat([decrypted, decipher.final()]);
                return decrypted.toString();
              }
              const decrypted = decrypt(data.Response)
              let pdfdata = Buffer.from(decrypted).toString();
              
              let file = fs.createWriteStream(`./ndm.png`);
              file.write(pdfdata);
              setTimeout(() => {
                  file.close();
                  return res.status(200).json({
                      code: 200,
                      success: true,
                      message: 'Done',
                  });
              }, 5000);
              // file.on('finish', () => {
              //     file.close();
              //     return res.status(200).json({
              //         code: 200,
              //         success: true,
              //         message: 'Done',
              //     });
              // })
          }).catch((err)=>{
              console.log("error",err);
              return res.status(200).json({
                  code: 400,
                  success: false,
                  message: 'Error',
                  data:err
              });
          })
      }, 5000);
    //   }else{
    //       return res.status(200).json({
    //           code: 400,
    //           success: false,
    //           message: 'Something Went Wrong',
    //       });
    // }
  } catch (ex) {
    next(ex);
  }
};
module.exports.compressFile = async (req, res, next) => {
  try {
    console.log("req.files",req.files.video.name);
    console.log("ffmpeg",ffmpeg);
    ffmpeg(req.files.video.name)
    .withOutputFormat("mp4")
    .on('end',function(stdout, stderr){
      console.log("finish");
      console.log("stdout",stdout);
      console.log("stderr",stderr);
    })
    .on('error',function(err){
      console.log("err",err);
    })
  } catch (ex) {
    console.log("tesginas");
    next(ex);
  }
};
// const userKyc = () => {
//     const saveFile = async(req, res) => {
//         console.log("req",req.files);
//         if (req.files != null) {
//             if (req.files.name != undefined) {
//               var url = await fireBase.uploadImageToStorage(req.files.name);
//               console.log("url",url);
//               req.body.name = url
//             }
//         }
//     }
//     return{
//         saveFile
//     }
// }
// module.exports = userKyc;