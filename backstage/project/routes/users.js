var express = require('express');
var router = express.Router();
var multer = require("multer");
let {
  connect,
  insert,
  find,
  update,
  del,
  ObjectId
} = require('../libs/mongdb');
var token = require('../libs/token');

//设置上传文件的存储路径和名字
var storage = multer.diskStorage({
  //设置上传后文件路径
  destination: function (req, file, cb) {
    cb(null, './Upload')
  },
  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    //给图片加上时间戳格式防止重名名
    //比如把 abc.jpg图片切割为数组[abc,jpg],然后用数组长度-1来获取后缀名
    cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});
var upload = multer({
  storage: storage
});


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//前端上传文件路由
router.post('/file_show', upload.single('abc'), async (req, res, next) => {
  res.send({
    show: 1,
    file: req.file
  })
})
//图片名字保存路由
router.get('/imgurl', async (req, res, next) => {
  let { imgurl, img_token } = req.query;
  let pass_token = token.decodeToken(img_token);
  let name_token = token.decodeToken(pass_token.payload.data.token1);
  let name = name_token.payload.data.name;
  let data = await update('study', { imgurl }, { name });
  res.send(data);
})
//获取头像路由
router.get('/get_img', async (req, res, next) => {
  let{img_token} = req.query;
  let pass_token = token.decodeToken(img_token);
  let name_token = token.decodeToken(pass_token.payload.data.token1);
  let name = name_token.payload.data.name;
  let data = await find('study', { name });
  res.send(data[0].imgurl);
})

// 登陆页面
//查询用户名查询路由
router.post('/find_user', async (req, res, next) => {
  let { name } = req.body;
  let data = await find(`study`, { name });
  if (data.length > 0) {
    res.send('用户名正确');
  }
})

//密码比对路由
router.post('/find_pass', async (req, res, next) => {
  let { name, password } = req.body;
  let data = await find('study', { name });
  if (data[0].password == password) {
    let token1 = token.createToken({ name }, 1800);
    let token2 = token.createToken({ password, token1 }, 1800);
    res.send({ show: 1, token2 });
  } else {
    res.send({ show: 0 });
  }
})

//token实效验证
router.post('/tokens', async (req, res, next) => {
  let value = req.body.key;
  let show = token.checkToken(value);
  res.send({ show: show });
})


//list页面路由
//查询所有信息路由
router.get('/find_all', async (req, res, next) => {
  let data = await find('information', {});
  res.send(data);
})

//查询个人信息路由
router.get('/find_per', async (req, res, next) => {
  let { name } = req.query;
  let data = await find('information', { name });
  res.send(data);
})


//add页面路由
//插入数据
router.get('/add', async (req, res, next) => {
  let { arr } = req.query;
  let data = await insert('information', arr);
  res.send(data);
})


//update页面路由
//修改信息路由
router.get('/upd', async (req, res, next) => {
  let { obj, obj_id } = req.query;
  let data = await update('information', obj, { "_id": ObjectId(obj_id._id) });
  res.send(data);
})


//del页面路由
//删除信息
router.get('/del', async (req, res, next) => {
  for (let i = 0; i < Object.keys(req.query).length; i++) {
    await del('information', { "_id": ObjectId(req.query[`id_${i}`]) });
  }
  res.send({n:1});
})

module.exports = router;
