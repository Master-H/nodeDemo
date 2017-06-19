var fs = require('fs')

exports.getAllAlbums = function (callback) {
  fs.readdir("./uploads",(err,files)=>{
    // console.log(files)//输出uploads中的：小猫 小狗 小猪
    if(err){
      // callback(err,null)
      callback("没有找到uploads文件夹",null)
      return
    }
    var allAlbums = [];
    // 异步变同步，使用迭代器
    (function iterator(i){
      if(i == files.length){
        //遍历结束输出allAlbums
        // console.log(allAlbums)//小猫 小狗 小猪
        //这里直接返回allAlbums，routre.js里面接收不到allAlbums,因为file.getAllAlbums()是异步的，
        //直接往下面同步线程执行，而此时还未收到return allAlbums,所以不能直接return,而用回调函数
        // return allAlbums;
        callback(null,allAlbums)
        return;//别忘了，不return，file.js调用不到getALLAlbums
      }
      //uploads/,/别少了
      fs.stat("./uploads/" + files[i],(err,stats)=>{
        if(err){
          callback("找不到文件"+files[i],null)
        }
        if(stats.isDirectory()){
          allAlbums.push(files[i])
        }
        //记得调用，不然allAlbums为空
        iterator(i+1)
      })
    })(0)
     //uploads/,/别少了
  //   for(var i = 0; i<files.length;i++){
  //     fs.statSync("./uploads/" + files[i],(err,stats)=>{
  //       if(err){
  //         callback("找不到文件"+files[i],null)
  //       }
  //       if(stats.isDirectory()){
  //         allAlbums.push(files[i])
  //       }
  //       //记得调用，不然allAlbums为空
  //       // iterator(i+1)
  //     })

  //   }
  // return allAlbums
  // })

  //为假的
  // return ['小猫猫猫','小狗','小猪']
  //通过文件名，得到所有图片 
  })
}
exports.getAllImagesByAlbumName = function(albumName,callback){
    fs.readdir("./uploads/" + albumName,function(err,files){
    // console.log(files)//输出uploads中的：小猫 小狗 小猪
      if(err){
        // callback(err,null)
        callback("没有找到uploads文件夹",null)
        return
      }
      var allImages  = [];
      //异步变同步，使用迭代器
      (function iterator(i){
        if(i == files.length){
          //遍历结束输出allAlbums
          // console.log(allImages)//小猫 小狗 小猪
          //这里直接返回allAlbums，routre.js里面接收不到allAlbums,因为file.getAllAlbums()是异步的，
          //直接往下面同步线程执行，而此时还未收到return allAlbums,所以不能直接return,而用回调函数
          // return allAlbums;
          callback(null,allImages)
          return//别忘了，不return，file.js调用不到getALLAlbums
        }
        //uploads/,/别少了
        fs.stat("./uploads/" + albumName + "/" + files[i],function(err,stats){
          if(err){
            callback("找不到文件" + files[i],null)
            return
          }
          if(stats.isFile()){
            allImages.push(files[i])
          }
          //记得调用，不然allAlbums为空
          iterator(i+1)
        })
      })(0)
    })
}