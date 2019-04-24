const R = require('ramda');
const rp = require('request-promise');
const cheerio = require('cheerio');
const url = 'https://coinmarketcap.com/';
let marketsUrl = url;
const fs = require('fs');

async function scrapCMC() {
  const cmcHTML = await rp(url);
  const $ = cheerio.load(cmcHTML);
  //    console.log($('.hidden-xs');
  //    const coinList = $('#currencies tr');
  
  //    console.log($('#currencies tr td.circulating-supply span.hidden-xs'));
      const coinSymbols = [];
      const coinMarketLink = [];
  
      const coinList = $('#currencies tr td.circulating-supply span.hidden-xs').each(function(i, elem) {
  //      console.log($(this).te"xt());
        //if ($(this).text() == "XRP") {
          coinSymbols.push($(this).text());
  //      }
      });
  
      
  //     const coinMarketUrls = $('td.currency-name > a.currency-name-container').each(function(i, elem) {
  // //            console.log($(this).attribes.href);
  
  
  //           });
        
            const coinMarketUrls = $('td.currency-name > a.currency-name-container').each(function(i, elm) {
              //console.log($(this)[0].attribs.href);
              coinMarketLink.push($(this)[0].attribs.href);
            });
  
  //    console.log(coinMarketUrls);
  
  //    console.log(R.filter(R.propEq("data", "XRP"))(coinList));  
      for (var i = 0; i < coinList.length; i++ )    {
  //      console.log(coinList[i].text());
  
          // if (coinList[i].children[0].data == "XRP") {
  
          // }
      }
  
      const matchedIndex = coinSymbols.findIndex(symbol => symbol === "XRP");
      console.log(coinMarketLink[matchedIndex]);
  
      marketsUrl += coinMarketLink[matchedIndex] + "/#markets";
      const cmcMarketsHTML = await rp(marketsUrl);
      const $$ = cheerio.load(cmcMarketsHTML);

      let marketExchanges = [];
      let marketExchangePrice = [];
      
      
      //marketExchanges.push()
      //console.log( $$("table#markets-table tr").find("td").eq(1).find("a") );

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

//      console.log(R.values(marketExchangePrice));

      fs.writeFile("priceList.txt", marketExchangePrice, function(err) {
          if(err) {
              return console.log(err);
          }

          console.log("The file was saved!");
      }); 

//      let maxPrice = Math.max(...marketExchangePrice);
      let maxPrice = Math.max(...marketExchangePrice);
      console.log(maxPrice);

      let minPrice = Math.min(...marketExchangePrice);
      console.log(minPrice);
    }

scrapCMC();
