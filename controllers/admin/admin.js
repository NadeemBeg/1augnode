const User = require("../../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    var user = await User.findOne({ email });
    if (!user)
      return res.json({ msg: "Incorrect Email", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Password", status: false });
    jwt.sign(user.email, 'svfsnifewuiry7quewyr83eyh', (err, token) => {
        delete user.password;
        return res
            .json({
                code: 2000,
                success: true,
                message: 'Logged in successfully',
                token: token,
                data: user
            });
        })
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if(email.trim() == "" || email.trim() == null){
      return res.json({ msg: "Please Enter email", status: false });
    }
    var checkEmail =  email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if(!checkEmail){
      return res.json({ msg: "Please Enter Email", status: false });
    }
    if(password == "" || password == null){
      return res.json({ msg: "Please Enter Password", status: false });
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};