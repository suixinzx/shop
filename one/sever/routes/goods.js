var express = require("express");
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

// 连接数据库    127.0.0.1
mongoose.connect('mongodb://localhost:27017/shop');

// 当数据库连接成功的时候触发
mongoose.connection.on('connected',function(){
  console.log("Mongodb connected success");
})

// 当数据库连接失败的时候触发
mongoose.connection.on('error',function(){
  console.log("Mongodb connected fail");
})

// 当数据库关闭连接的时候触发
mongoose.connection.on('disconnected',function(){
  console.log("Mongodb connected disconnected");
})

router.get("/list",function(req,res,next){

  let sort = req.param("sort");
  let priceLevel = req.param("priceLevel");
  let page = parseInt(req.param("page"));
  let pageSize =parseInt(req. param("pageSize")) ;
  let sip =parseInt((page-1)*pageSize) ;
  let priceGt = '',priceLte = '';
  let param = {};
  if(priceLevel != 'all'){
    switch (priceLevel) {
      case '0': priceGt = 0; priceLte = 100;break;
      case '1': priceGt = 100; priceLte = 500;break;
      case '2': priceGt = 500; priceLte = 1000;break;
      case '3': priceGt = 1000; priceLte = 5000;break;
    }

    param = {
      salePrice:{
        $gt:priceGt,
        $lte:priceLte,
      }
    }
  }

  let goodModel = Goods.find(param).limit(pageSize).skip(sip);
  goodModel.sort({'salePrice':sort});

  goodModel.exec({},function(err, docs){
    console.log(page, pageSize);
    res.json({
      status:'0',
      result:docs
    })
  })
})
router.post("/addCart", function(req,res,next){
  var userId = '100000077',productId = req.body.productId;
  var User = require('../models/user');
  User.findOne({userId:userId},function(err,userDoc){
    let goodItem = '';
    res.json(userDoc.cartList);

    userDoc.cartList.forEach(function(item){
      if(item.productId == productId) {
        goodItem = item;
        item.productNum ++;
      }
    })

    if(goodItem){
      // 说明你购物车里面存在这个商品
      userDoc.save(function(err3,doc3){
        if(err3){
          res.json({
            status:"1",
            msg:err.message
          })
        }else{
          res.json({
            status:"0",
            result:"商品数量添加成功！"
          })
        }
      });
    }else{
      // 此时的逻辑是当商品第一次添加到购物车里面

      // 通过productId查询出一条商品，然后把这一条商品，存入到user的cartList里面。
      Goods.findOne({productId:productId},function(err1,goodsDoc){
        // 添加相同的商品，商品只添加一次，数量加1
        goodsDoc.productNum = 1;
        goodsDoc.checked = 1;
        userDoc.cartList.push(goodsDoc);
        userDoc.save(function(err2,doc2){
          if(err2){
            res.json({
              status:"1",
              msg:err.message
            })
          }else{
            res.json({
              status:0,
              msg:'',
              result:"此商品第一次加入购物车！"
            })
          }
        })
      })

    }
  })
})

module.exports = router;
