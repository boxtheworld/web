const express = require("express");
var app = express();
// 拿到json数据
var sellData = require("./data.json");

var seller = sellData.seller;
var goods = sellData.goods;
var ratings = sellData.ratings;
app.use(express.static("./"))

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

app.listen(8080);
console.log(8080);