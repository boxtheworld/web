const express = require("express");
var app = express();
// 拿到json数据
var sellData = require("./data.json");

var seller = sellData.seller;
var goods = sellData.goods;
var ratings = sellData.ratings;

// vue.config.js   去vue-cli 3.0以上版本官网看
module.exports = {
  devServer: { //  webpack-dev-server 官网
    host: "localhost",
    port: "8080",
    before(app) { // api接口  暴露数据
      app.get("/api/seller", (req, res) => {
        res.json({
          errno: 0,
          seller: seller
        })
      })
      app.get("/api/goods", (req, res) => {
        res.json({
          errno: 0,
          goods: goods
        })
      })
      app.get("/api/ratings", (req, res) => {
        res.json({
          errno: 0,
          ratings: ratings
        })
      })
    }
  }
}