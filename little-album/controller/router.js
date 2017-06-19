var file = require('../models/file.js')
var formidable = require('formidable')
var path = require('path')
var fs = require("fs")
//时间线用的
var sd = require('silly-datetime')

exports.showIndex = function(req,res,next){
  // res.send('我是首页')
  // 这样写不会，因为getALLalbums异步原因，具体看models中的file.js
  // res.render("index",{
  //   "albums":file.getAllAlbums()/
  // });
//node.js编程思想，所有东西都是异步的，所以内层函数，不是return回来东西，而是调用高层函数提供的回调函数，
//把数据当做回调函数的参数来使用
//回调函数也有两个参数
  file.getAllAlbums(function(err,allAlbums){
    if(err){
      next()//出错时，调用next,app.js的中间件之间走向下一个（get)
      // res.render("err"),没有上面一行方法好
      return;
    }
    res.render("index",{
      "albums":allAlbums
    })
  })
}

//相册页面
exports.showAlbum = function(req,res,next){
  //遍历相册中的所有图片
  var albumName = req.params.albumName;
  //具体业务交给models
  file.getAllImagesByAlbumName(albumName,function(err,imagesArray){
    if(err){
      next()
      // res.render("err")
      return
    }
    res.render("album",{
      "albumname":albumName,
      "images":imagesArray
    })
  })
 
  // res.send("相册"+ req.params.albumName)
}

//显示上传
exports.showUp = function(req,res,next){
  //getAllAlbums得到文件夹的个数名字
  file.getAllAlbums((err,albums)=>{
    res.render("up",{
      "albums":albums
      // "jumppath":fields.wenjianjia
    })
  })
}

//上传表单
exports.doPost = function(req,res){
  var form = new formidable.IncomingForm();
  //tempup中转站
  form.uploadDir = path.normalize(__dirname +  "/../tempup/");
  // console.log(path.normalize(__dirname +  "/../tempup/"))  
  form.parse(req, function(err, fields, files,next) {
    // console.log(fields)
    // console.log(files)
    if(err){
      next();//这个中间件不受理这个请求了，往下走
      return;
    }
     //判断文件的尺寸
    var size = parseInt(files.tupian.size)
    if(size>100000000){
      res.send("图片尺寸一个小于1M")//报错原因，因为这是异步的下面已经有一个send所以执行
      // 到异步的send两个send会报错
      fs.unlink(files.tupian.path)  
      return    
    }
    var ttt = sd.format(new Date(), 'YYYYMMDDHHmmss');
    var ran = parseInt(Math.random() * 89999 + 10000);
    //获取扩展名
    var extname = path.extname(files.tupian.name);
      //tupian是有ue.ejs中name属性决定，path属于files中的一个属性，可以console输出看看
      var wenjianjia = fields.wenjianjia;
      var oldpath = files.tupian.path;
      var newpath = path.normalize(__dirname +  "/../uploads/" + wenjianjia + "/" + ttt + ran + extname)
      //fs.rename移动文件位置
      fs.rename(oldpath,newpath,function(err){
        if(err){
          next()
          res.send("改名失败");
          retrun;
        }

       file.getAllAlbums(function(err,allAlbums){
          res.render("index",{
            "albums":allAlbums
            // "jumppath":
          })
        })
      })
        // res.render("index",{
        //   "albums":allAlbums
        // });
      // })
      // res.writeHead(200, {'content-type': 'text/plain'});
      // res.write('received upload:\n\n');
      // res.end(util.inspect({fields: fields, files: files}));
  });
 
    // res.end("success");
}