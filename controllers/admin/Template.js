const templateModel = require("../../models/template")
const templateDataModel = require("../../models/templateData")
const fireBase = require('../../helper/fireStoragedetails');

module.exports.save = async (req, res, next) => {
  try {
    if (req.files != null) {  
        if (req.files.bg_img != undefined) {
            let folder = 'Template'
            let url = await fireBase.uploadImageToStorage(folder,req.files.bg_img);
            req.body.bg_img = url;
        }
    }
    let template;
    if(req.body.id){
        template = await templateModel.findOneAndUpdate({_id:req.body.id},{
            title: req.body.title ? req.body.title : null,
            sub_title: req.body.sub_title ? req.body.sub_title : null,
            comment: req.body.comment ? req.body.comment : null,
            bg_img: req.body.bg_img ? req.body.bg_img : null,
        });
        const templateData = await templateDataModel.findOneAndUpdate({template_id:req.body.id},{
            is_name: req.body.is_name ? req.body.is_name : 'false',
            is_course: req.body.is_course ? req.body.is_course : 'false', 
            is_score: req.body.is_score ? req.body.is_score : 'false',
            is_sinature: req.body.is_sinature ? req.body.is_sinature : 'false',
            is_date: req.body.is_date ? req.body.is_date : 'false',
        });
        return res.json({ status: true, message: `Data Updated Successfully`});
    }else{
        template = await templateModel.create({
            title: req.body.title ? req.body.title : null,
            sub_title:req.body.sub_title ? req.body.sub_title : null,
            comment: req.body.comment ? req.body.comment : null,
            bg_img: req.body.bg_img ? req.body.bg_img : null,
        });
        const templateData = await templateDataModel.create({
            template_id: template._id,
            is_name: req.body.is_name ? req.body.is_name : 'false',
            is_course: req.body.is_course ? req.body.is_course : 'false', 
            is_score: req.body.is_score ? req.body.is_score : 'false',
            is_sinature: req.body.is_sinature ? req.body.is_sinature : 'false',
            is_date: req.body.is_date ? req.body.is_date : 'false',
        });
        return res.json({ status: true, message: `Data Added successfully`, data: template });
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports.get = async (req, res, next) => {
  try {
    let template;
    if(req.query.id){
        template = await templateModel.find({_id:req.query.id});
    }else{
        template = await templateModel.find({});
    }
    if(template.length == 0){
        return res.json({ status: false, message: 'No data Found', data: template });
    }
    let arrData = [];
    for(let data of template){
        let obj = {
            id:data._id,
            bg_img: data.bg_img,
            title: data.title,
            sub_title: data.sub_title,
            comment: data.comment,
        };
        let templateData =  await templateDataModel.find({ template_id: data._id }).then((teplateData)=>{
            obj.data = teplateData; 
        })
        arrData.push(obj)
    }

    return res.json({ status: true, message: "Data get successfully", data: arrData });
  } catch (ex) {
    next(ex);
  }
};

module.exports.deleteTemplate = async (req, res, next) => {
  try {
    await templateDataModel.deleteOne({template_id:req.body.id});
    await templateModel.deleteOne({_id:req.body.id});
    return res.json({ status: true, message: "Data Deleted successfully" });
  } catch (ex) {
    next(ex);
  }
};
