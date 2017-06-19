var express = require('express')
var app = express();
// var router  = require('./controller/router.js')
//写了入口文件，所以不用具体到router.js
var router = require("./controller")
//设置模板引擎
app.set("view engine","ejs")

//路由中间件
//静态页面
app.use(express.static("./public"))
app.use(express.static("./uploads"))
//为了避免阻碍下面路由被阻止加static 
// app.use("/static",express.static("./public"))

//首页
app.get('/',router.showIndex)
//这里的内容不会显示，因为从上到下执行，上面public也有admin，被静态 先占了
app.get("/admin",(req,res)=>{
  res.send("admin")
})
app.get("/:albumName",router.showAlbum)
app.get("/up",router.showUp)
app.post("/up",router.doPost)
//最后的中间件404
app.use(function(req,res){
  res.render("err")
})
app.listen(3000)