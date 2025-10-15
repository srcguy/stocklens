import express from 'express';
import yahooFinance from 'yahoo-finance2';
import cors from 'cors';
const app = express();

app.use(cors())
app.use(express.json());

app.post('/', async(req, res) => {
    const symbol = await req.body.symbol;
    const range = await req.body.range;
    const quote = await yahooFinance.quote(symbol);
    console.log(quote);
    var datetime = new Date();
    if (isNaN(range) == false)
    {
      datetime.setDate(datetime.getDate() - range);
    }
    else
    {
      datetime.setDate(datetime.getDate() - 7);
    }
    const queryOptions = { period1: datetime.toISOString().slice(0,10), /* ... */ };
    const history = await yahooFinance.historical(symbol, queryOptions);
    console.log(history);
    var currencySymbol
    if (quote.currency == "USD")
    {
      currencySymbol = "$"
    }
    else if (quote.currency == "EUR")
    {
      currencySymbol = "€"
    }
    else {
      currencySymbol = quote.currency;
    }
    res.json({
      symbol,
      companyName: quote.shortName,
      currentPrice: quote.regularMarketPrice,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      previousClose: quote.regularMarketPreviousClose,
      exchange: quote.fullExchangeName,
      dividend: quote.trailingAnnualDividendYield,
      pe: quote.trailingPE,
      avgVolume: quote.averageDailyVolume3Month,
      capitalization: quote.marketCap,
      currency: currencySymbol,

      historyData: history.reverse()
    });
})

app.post('/fav', async(req, res) => {
  const quote = await yahooFinance.quote(req.body.symbol);
  res.json({
    currentPrice: quote.regularMarketPrice, 
    previousClose: quote.regularMarketPreviousClose, 
    companyName: quote.shortName ,
    symbol: req.body.symbol
  });
});

app.post('/indexes', async(req, res) => {
  const symbolList = ["^GSPC", "^DJI", "^IXIC", "^NDX", "^NYA", "^FTSE", "^FCHI", "^GDAXI", "^STOXX50E","^N225", "^HSI", "^AXJO"]; //5x usa, 4x eu, 3x asia
  const dataList = [];
  for (const symbol of symbolList) {
    const quote = await yahooFinance.quote(symbol);
    //console.log(quote);
    dataList.push([quote.regularMarketPrice, quote.regularMarketPreviousClose, quote.shortName ,symbol]);
  }
  res.json({
    dataList
  });
});

app.get('/indexes', async(req, res) => {
  const symbolList = ["^GSPC", "^DJI", "^IXIC", "^NDX", "^NYA", "^FTSE", "^FCHI", "^GDAXI", "^STOXX50E","^N225", "^HSI", "^AXJO"]; //5x usa, 4x eu, 3x asia
  const dataList = [];
  for (const symbol of symbolList) {
    const quote = await yahooFinance.quote(symbol);
    //console.log(quote);
    dataList.push([quote.regularMarketPrice, quote.regularMarketPreviousClose, quote.shortName ,symbol]);
  }
  res.json({
    dataList
  });
});

app.post('/crypto', async(req, res) => {
  const symbolList = ["BTC-USD", "ETH-USD", "XRP-USD", "USDT-USD", "BNB-USD", "SOL-USD", "USDC-USD", "DOGE-USD", "STETH-USD","TRX-USD", "ADA-USD", "WTRX-USD"];
  const dataList = [];
  for (const symbol of symbolList) {
    const quote = await yahooFinance.quote(symbol);
    //console.log(quote);
    dataList.push([quote.regularMarketPrice, quote.regularMarketPreviousClose, quote.shortName ,symbol]);
  }
  res.json({
    dataList
  });
});

app.post('/currencies', async(req, res) => {
  const symbolList = ["EURUSD=X", "JPY=X", "GBPUSD=X", "AUDUSD=X", "NZDUSD=X", "EURJPY=X", "GBPJPY=X", "EURGBP=X", "EURCAD=X", "EURSEK=X", "EURCHF=X", "EURHUF=X"];
  const dataList = [];
  for (const symbol of symbolList) {
    const quote = await yahooFinance.quote(symbol);
    //console.log(quote);
    dataList.push([quote.regularMarketPrice, quote.regularMarketPreviousClose, quote.shortName ,symbol]);
  }
  res.json({
    dataList
  });
});


app.post('/trending', async(req, res) => {
  const dataList = [];
  const quote = await yahooFinance.trendingSymbols('US', {count: 12});
  const symbolList = quote.quotes;
  for (const symbol of symbolList) {
    const quote = await yahooFinance.quote(symbol.symbol);
    //console.log(quote);
    dataList.push([quote.regularMarketPrice, quote.regularMarketPreviousClose, quote.shortName ,quote.symbol]);
  }
  res.json({
    dataList
  });
});

app.get('/', (req, res) => {
  res.send('Backend works!'); 
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

