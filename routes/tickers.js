const fetch = require("node-fetch");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Ticker } = require("../models/ticker");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

const R = require('ramda');
const rp = require('request-promise');
const cheerio = require('cheerio');
const url = 'https://coinmarketcap.com';
let marketsUrl = url;






async function scrapCMC(ticker = "xrp") {
  const coinSymbols = [];
  const coinMarketLink = [];

  const $ = await cheerio.load(await rp(url));
  const coinList = $('#currencies tr td.circulating-supply span.hidden-xs').each(function() {
    coinSymbols.push($(this).text());
  });
  const coinMarketUrls = $('td.currency-name > a.currency-name-container').each(function() {
    coinMarketLink.push($(this)[0].attribs.href);
  });
  let matchedIndex = coinSymbols.findIndex(symbol => R.equals(symbol, R.toUpper(ticker)) );
//  $$ = cheerio.load( await rp(R.concat(marketsUrl, coinMarketLink[matchedIndex], "/#markets") ));
  $$ = await cheerio.load( await rp(R.concat(marketsUrl, coinMarketLink[matchedIndex], "/#markets") ));

  let marketExchanges = [];
  let marketExchangePrice = [];

  let exchangeNames = $$("table#markets-table tr").each(function () {
    $$(this).find("td").eq(1).find("a").each(function() {
      marketExchanges.push( $$(this).text() );
    });
  })

  
  let exchangePrices = $$("table#markets-table tr").each(function () {
    $$(this).find("span.price").each(function() {
      marketExchangePrice.push( $$(this).data().usd );
    });
  })
  let maxPrice = Math.max(...marketExchangePrice);
//  console.log(maxPrice);
  let minPrice = Math.min(...marketExchangePrice);
//  console.log(minPrice);
  let matchedIndexMax = marketExchangePrice.findIndex(price => R.equals(price, maxPrice) );
//  console.log(matchedIndex);
//  console.log(marketExchanges[matchedIndex]);

  let matchedIndexMin = marketExchangePrice.findIndex(price => R.equals(price, minPrice) );
  let arbitrage = {
    exchangeMax: marketExchanges[matchedIndexMax],
    exchangeMin: marketExchanges[matchedIndexMin],
    maxPrice: maxPrice,
    minPrice: minPrice,
    symbol: ticker
  };
  

  console.log(arbitrage);
  return arbitrage;
}

router.get("/arbitrage/:id", async (req, res) => {
  let tickers = await Ticker.find({linkedID: req.params.id});
  let arbitrage = [];
  
  await Promise.all(tickers.map(async t => {
    const result = await scrapCMC(t.ticker);
    arbitrage.push(result);
  }));

  res.json(arbitrage);
});

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
