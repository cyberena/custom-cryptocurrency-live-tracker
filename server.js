const fetch = require("node-fetch");
const winston = require("winston");
const config = require("config");
const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/users");
const auth = require("./routes/auth");
const tickers = require("./routes/tickers");
const cors = require("cors");
const { Ticker } = require("./models/ticker");
const db = config.get("db");

var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

const port = process.env.PORT || config.get("port");
server.listen(port, () => 
  winston.info(`Listening on port ${port}...`)
);

io.on('connection', (client) => {
  let socket = "";
  client.on('subscribeToTimer', async (userID) => {
    socket = setInterval( async () => {
        //get tickers list from db
      let tickers = await Ticker.find({linkedID: userID});
      console.log(tickers);
      //get latest tickers from binance
      tickers.map(async t => {
        let result = await fetch("https://api.binance.com/api/v1/ticker/price?symbol=" + t.ticker.toUpperCase() + "BTC");
        result = await result.json();
        console.log(result);
        if ((t.price == 0) || (t.price != result.price)) {
          let newTicker = await Ticker.findOneAndUpdate({linkedID: userID, ticker: t.ticker}, {price: result.price}, {new: true});
          //update db and send it to the front end
          client.emit('tickerUpdate', { newTicker: newTicker });
        }
      });
    }, 5000);
  });

  client.on('disconnect', function () {
    // dispose tail file listener
    clearInterval(socket);
  });
});


mongoose.connect(db).then(() => console.log(`Connected to ${db}...`));

app.use(express.json());
app.use(cors());
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/tickers", tickers);

//reverse proxy, not needed anymore
// app.use('/*', async (req, res) => {
//   const uurl = 'http://api.binance.com' + req.originalUrl;
//   const x = request(uurl);
//   req.pipe(x);
//   x.pipe(res);
// });

module.exports = server;
