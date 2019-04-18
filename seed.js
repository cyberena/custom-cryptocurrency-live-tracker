const { Ticker } = require("./models/ticker");
const mongoose = require("mongoose");
const config = require("config");

//mongoose.connect(db).then(() => console.log(`Connected to ${db}...`));

async function seed() {
  await mongoose.connect(config.get("db"));
  await Ticker.deleteMany({});
     let tickersArray = [];
     tickersArray.push(new Ticker({ticker: 'xrp', price: 0, linkedID: "anon" }));
     tickersArray.push(new Ticker({ticker: 'eos', price: 0, linkedID: "anon" }));
     tickersArray.push(new Ticker({ticker: 'eth', price: 0, linkedID: "anon" }));
     tickersArray.push(new Ticker({ticker: 'bnb', price: 0, linkedID: "anon" }));
     tickersArray.push(new Ticker({ticker: 'ltc', price: 0, linkedID: "anon" }));
    await Ticker.insertMany(tickersArray);
    mongoose.disconnect();
}

seed();