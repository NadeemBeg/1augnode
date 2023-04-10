const jwt = require('jsonwebtoken');

exports.verifyAuth = async (req, res, next) => {
    try{
        const {authorization} = req.headers;
        if(!authorization){
            res.status(419).json({
                status: 0 ,
                message: "authorization is required."
            })
        }
        await jwt.verify(authorization, 'svfsnifewuiry7quewyr83eyh',  function(error, data) {
            if(error){
                res.status(401).json({message:error, status: 0});
            }
            req.user = data.data;
            next();
        });
    }catch(error){
        res.status(419).json({
            status: 0 ,
            message: "authorization is failed.",
            error
        })
    }
}