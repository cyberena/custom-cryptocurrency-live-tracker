const fetch = require("node-fetch");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Ticker } = require("../models/ticker");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/:id", async (req, res) => {
  console.log(req.params.id);
  const tickers = await Ticker.find({linkedID: req.params.id});
  console.log(tickers);
  res.send(tickers);
});


router.get("/update/:id", async (req, res) => {
  let tickers = await Ticker.find({linkedID: req.params.id});
  
  tickers.map(async t => {
    let result = await fetch("https://api.binance.com/api/v1/ticker/price?symbol=" + t.ticker.toUpperCase() + "BTC");
    result = await result.json();
    if (result.code) {
      await Ticker.findOneAndUpdate({linkedID: req.params.id, ticker: t.ticker}, {price: null});
    } else {
      await Ticker.findOneAndUpdate({linkedID: req.params.id, ticker: t.ticker}, {price: result.price});
    }
    
  });
  const tickers2 = await Ticker.find({linkedID: req.params.id});
  res.send(tickers2);
});

router.post("/", async (req, res) => {
  await Ticker.deleteMany({ linkedID: req.body.updateTicker.userID });

  let { tickers } = req.body.updateTicker;
  tickers = tickers.replace(/ /g,'').split(",");
  let tickersArray = [];

  tickers.map(async t => {
    let obj = new Ticker({ticker: t, price: 0, linkedID: req.body.updateTicker.userID });
    tickersArray.push(obj);
  });

  await Ticker.insertMany(tickersArray);

  res.send("ok");
  // res
  //   .header("x-auth-token", token)
  //   .send(data);
});

router.post("/update", async (req, res) => {

//working code
let user = await User.findOneAndUpdate({ email: req.body.email }, { name: req.body.name }, {new: true});
  const token = user.generateAuthToken();
  res.json({
    success: true,
    message: 'Enjoy your token!',
    token: token,
  });
});




module.exports = router;
