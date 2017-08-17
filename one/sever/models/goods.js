/**
 * Created by admin on 2017/8/10.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productSchema = new Schema({
  "productId":String,
  "productName":String,
  "salePrice":Number,
  "productImage":String,
  "productNum":Number,
  "checked":String
})

module.exports = mongoose.model("Goods",productSchema);
