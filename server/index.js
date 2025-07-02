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
    if (quote.currency == "EUR")
    {
      currencySymbol = "€"
    }
    res.json({
      symbol,
      companyName: quote.longName,
      currentPrice: quote.regularMarketPrice,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      previousClose: quote.regularMarketPreviousClose,
      capitalization: quote.marketCap,
      currency: currencySymbol,
      historyData: history.reverse()
    });
})

app.post('/aside', async(req, res) => {
    const symbolList = ["^GSPC", "^DJI", "^IXIC"];
    const dataList = [];
    for (const symbol of symbolList) {
      const quote = await yahooFinance.quote(symbol);
      console.log(quote);
      var datetime = new Date();
      datetime.setDate(datetime.getDate() - 7);
      const queryOptions = { period1: datetime.toISOString().slice(0,10), /* ... */ };
      const history = await yahooFinance.historical(symbol, queryOptions);
      console.log(history);
      const formatted = history.map(item => ({
          date: item.date.toISOString().slice(0,10),
          close: item.close
      }));
      var currencySymbol
      if (quote.currency == "USD")
      {
        currencySymbol = "$"
      }
      if (quote.currency == "EUR")
      {
        currencySymbol = "€"
      }
      dataList.push([quote.regularMarketPrice, quote.regularMarketPreviousClose, currencySymbol, formatted, symbol]);
    }
    res.json({
      list: dataList
    });
    });

app.listen(8080, () => {
    console.log('server listening on port 8080')
})