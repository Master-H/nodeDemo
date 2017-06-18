var file = require('../models/file.js')

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