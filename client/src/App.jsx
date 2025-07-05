import axios from 'axios';
import './index.css'
import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

function App() {
  const [data, setData] = useState(null);
  const [info, setInfo] = useState(null);
  const [dataAside, setDataAside] = useState(null);
  const [dataAsideNoChart, setDataAsideNoChart] = useState(null);
  const API_URL = "http://localhost:8080"; //https://stocklens-5fqm.onrender.com

  var rangeDays = 5;
  function rangeChange(symbolGet) {
    if (event.keyCode == 13)
    {
      if (document.getElementById("days") != null && document.getElementById("days").value != ''){
        rangeDays = document.getElementById("days").value;
        handleSubmit(symbolGet, rangeDays)
      }
      else {
        rangeDays = 7;
        handleSubmit(symbolGet, rangeDays)
      }
    }
  }
  
  const handleSubmit = async(symbolGet, rangeDays) => {
    if (rangeDays == ''){
      rangeDays = "7";
    }
    const search = await axios.post(API_URL, { symbol: symbolGet, range: rangeDays});
    console.log(search.data.historyData);
    const formatted = search.data.historyData.map(item => ({
        date: item.date.slice(0,10),
        close: item.close
    }));
    setData(formatted.reverse());
    console.log(data)
    setInfo(search)
    console.log(info)
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="tooltip">
          <p>Data: {label}</p>
          <p>Cena: {payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };


  useEffect(() => {
    const fetchData = async () => {
      const search = await axios.post(API_URL+'/aside', {});
      const search2 = await axios.post(API_URL+'/asideNoChart', {});
      //console.log(search2);
      setDataAside(search)
      setDataAsideNoChart(search2)
    }
    fetchData();
    setInterval(async() => fetchData(), 5000)
  }, [])

  function MainChart({ data }){
    return (
      <ResponsiveContainer id="chart" width="100%" height={400}>
        <LineChart data={data}>
        <CartesianGrid strokeDasharray="1 4" />
        <XAxis dataKey="date" />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip content={<CustomTooltip />} />
        <Line isAnimationActive={false} type="monotone" dataKey="close" stroke="gray" dot={true} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  function AsideChart({ dataAside, index }){
    return (
    <ResponsiveContainer id="chart" width="100%" height={50}>
      <LineChart data={dataAside.data.list[index][3]}>
      <XAxis dataKey="date" hide={true}/>
      <YAxis domain={['auto', 'auto']} hide={true}/>
      <Line isAnimationActive={false} type="monotone" dataKey="close" stroke={dataAside.data.list[index][0] > dataAside.data.list[index][1] ? 'green' : 'red' } dot={false}/>
      </LineChart>
    </ResponsiveContainer>  
    )
  }

  return (
    <>
    <div id="bar">
      <h1>Stocklens</h1>
      <div id="empty"></div>
      <input onKeyDown={() => rangeChange(document.getElementById("search").value.toUpperCase())} type='text' class="search" id="search" name="search" placeholder='Symbol...'></input>
      <button onClick={() => handleSubmit(document.getElementById("search").value.toUpperCase(), "7")} id="search_button">🔎</button>
    </div>
    <section>
    <aside>
      <div class="aside_panel aside_left">
        <h3>GPW</h3>
        { dataAsideNoChart != null && (
        <>
        <div class="panel" onClick={() => handleSubmit("WIG20.WA", "7")}>
          <h4>WIG20</h4>
          <h5 style={{color: dataAsideNoChart.data.list[0][0] > dataAsideNoChart.data.list[0][1] ? 'green' : 'red' }}>{dataAsideNoChart.data.list[0][0]}</h5>
          <h5 style={{color: dataAsideNoChart.data.list[0][0] > dataAsideNoChart.data.list[0][1] ? 'green' : 'red' }}>{((dataAsideNoChart.data.list[0][0] - dataAsideNoChart.data.list[0][1]) / dataAsideNoChart.data.list[0][1] * 100).toFixed(2)}%</h5>
        </div>
        <div class="panel" onClick={() => handleSubmit("mWIG40.WA", "7")}>
          <h4>mWIG40</h4>
          <h5 style={{color: dataAsideNoChart.data.list[1][0] > dataAsideNoChart.data.list[1][1] ? 'green' : 'red' }}>{dataAsideNoChart.data.list[1][0]}</h5>
          <h5 style={{color: dataAsideNoChart.data.list[1][0] > dataAsideNoChart.data.list[1][1] ? 'green' : 'red' }}>{((dataAsideNoChart.data.list[1][0] - dataAsideNoChart.data.list[1][1]) / dataAsideNoChart.data.list[1][1] * 100).toFixed(2)}%</h5>
        </div>
        <div class="panel" onClick={() => handleSubmit("sWIG80.WA", "7")}>
          <h4>sWIG80</h4>
          <h5 style={{color: dataAsideNoChart.data.list[2][0] > dataAsideNoChart.data.list[2][1] ? 'green' : 'red' }}>{dataAsideNoChart.data.list[2][0]}</h5>
          <h5 style={{color: dataAsideNoChart.data.list[2][0] > dataAsideNoChart.data.list[2][1] ? 'green' : 'red' }}>{((dataAsideNoChart.data.list[2][0] - dataAsideNoChart.data.list[2][1]) / dataAsideNoChart.data.list[2][1] * 100).toFixed(2)}%</h5>
        </div>
        </>
        )}
      </div>
      <div class="aside_panel aside_left">
        <h3>Currencies</h3>
        { dataAsideNoChart != null && (
        <>
        <div class="panel" onClick={() => handleSubmit("EURUSD=X", "7")}>
          <h4>EUR/USD</h4>
          <h5 style={{color: dataAsideNoChart.data.list[3][0] > dataAsideNoChart.data.list[3][1] ? 'green' : 'red' }}>{dataAsideNoChart.data.list[3][0]}</h5>
          <h5 style={{color: dataAsideNoChart.data.list[3][0] > dataAsideNoChart.data.list[3][1] ? 'green' : 'red' }}>{((dataAsideNoChart.data.list[3][0] - dataAsideNoChart.data.list[3][1]) / dataAsideNoChart.data.list[3][1] * 100).toFixed(2)}%</h5>
        </div>
        <div class="panel" onClick={() => handleSubmit("PLN=X", "7")}>
          <h4>USD/PLN</h4>
          <h5 style={{color: dataAsideNoChart.data.list[4][0] > dataAsideNoChart.data.list[4][1] ? 'green' : 'red' }}>{dataAsideNoChart.data.list[4][0]}</h5>
          <h5 style={{color: dataAsideNoChart.data.list[4][0] > dataAsideNoChart.data.list[4][1] ? 'green' : 'red' }}>{((dataAsideNoChart.data.list[4][0] - dataAsideNoChart.data.list[4][1]) / dataAsideNoChart.data.list[4][1] * 100).toFixed(2)}%</h5>
        </div>
        <div class="panel" onClick={() => handleSubmit("EURPLN=X", "7")}>
          <h4>EUR/PLN</h4>
          <h5 style={{color: dataAsideNoChart.data.list[5][0] > dataAsideNoChart.data.list[5][1] ? 'green' : 'red' }}>{dataAsideNoChart.data.list[5][0]}</h5>
          <h5 style={{color: dataAsideNoChart.data.list[5][0] > dataAsideNoChart.data.list[5][1] ? 'green' : 'red' }}>{((dataAsideNoChart.data.list[5][0] - dataAsideNoChart.data.list[5][1]) / dataAsideNoChart.data.list[5][1] * 100).toFixed(2)}%</h5>
        </div>
        </>
        )}
      </div>
      <div class="aside_panel aside_left">
        <h3>Crypto</h3>
        { dataAsideNoChart != null && (
        <>
        <div class="panel" onClick={() => handleSubmit("BTC-USD", "7")}>
          <h4>BTC/USD</h4>
          <h5 style={{color: dataAsideNoChart.data.list[6][0] > dataAsideNoChart.data.list[6][1] ? 'green' : 'red' }}>{dataAsideNoChart.data.list[6][0].toFixed(1)}</h5>
          <h5 style={{color: dataAsideNoChart.data.list[6][0] > dataAsideNoChart.data.list[6][1] ? 'green' : 'red' }}>{((dataAsideNoChart.data.list[6][0] - dataAsideNoChart.data.list[6][1]) / dataAsideNoChart.data.list[6][1] * 100).toFixed(2)}%</h5>
        </div>
        <div class="panel" onClick={() => handleSubmit("ETH-USD", "7")}>
          <h4>ETH/USD</h4>
          <h5 style={{color: dataAsideNoChart.data.list[7][0] > dataAsideNoChart.data.list[7][1] ? 'green' : 'red' }}>{dataAsideNoChart.data.list[7][0].toFixed(2)}</h5>
          <h5 style={{color: dataAsideNoChart.data.list[7][0] > dataAsideNoChart.data.list[7][1] ? 'green' : 'red' }}>{((dataAsideNoChart.data.list[7][0] - dataAsideNoChart.data.list[7][1]) / dataAsideNoChart.data.list[7][1] * 100).toFixed(2)}%</h5>
        </div>
        <div class="panel" onClick={() => handleSubmit("SOL-USD", "7")}>
          <h4>SOL/USD</h4>
          <h5 style={{color: dataAsideNoChart.data.list[8][0] > dataAsideNoChart.data.list[8][1] ? 'green' : 'red' }}>{dataAsideNoChart.data.list[8][0].toFixed(2)}</h5>
          <h5 style={{color: dataAsideNoChart.data.list[8][0] > dataAsideNoChart.data.list[8][1] ? 'green' : 'red' }}>{((dataAsideNoChart.data.list[8][0] - dataAsideNoChart.data.list[8][1]) / dataAsideNoChart.data.list[8][1] * 100).toFixed(2)}%</h5>
        </div>
        </>
        )}
      </div>
    </aside>
    <main>
    { info && (
      <div id="panel">
        <h2 id="name">{info.data.companyName}</h2><h2 id="symbol">{info.data.symbol}</h2> 
        <h3 class="price" style={{ color: info.data.currentPrice > info.data.previousClose ? 'green' : 'red' }}>{info.data.currentPrice} {info.data.currency}</h3>
        <h4 class="percent" style={{ color: info.data.currentPrice > info.data.previousClose ? 'green' : 'red' }}>{((info.data.currentPrice - info.data.previousClose) / info.data.previousClose * 100).toFixed(2)}%</h4>
        <div id="empty"></div>
        <input onKeyDown={() => rangeChange(document.getElementById("symbol").innerText)} type='text' class="days" id="days" name="days" placeholder='Range (in days)...'></input>
      </div>
    )}
    {data != null && <MainChart data={data}/>}
    { info && (
      <div id="panel_bottom">
      <div>
        <h3>Previous close: {info.data.previousClose}</h3>
        <h3>Open: {info.data.open}</h3>
        <h3>Bid: {info.data.bid}</h3>
        <h3>Ask: {info.data.ask}</h3>
      </div>
      <div>
        <h3>Day's range: {info.data.low} - {info.data.high}</h3>
        <h3>52 week range: {info.data.ftwLow} - {info.data.ftwHigh}</h3>
        <h3>Volume: {info.data.volume}</h3>
        <h3>Avg. volume: {info.data.avgVolume}</h3>
      </div>
      <div>
        {info.data.capitalization != null && (<h3>Market cap.: {info.data.capitalization}</h3>)}
      </div>
      <div>
        <button onClick={() => handleSubmit(document.getElementById("symbol").innerText, "5")}>5d</button>
        <button onClick={() => handleSubmit(document.getElementById("symbol").innerText, "7")}>1w</button>
        <button onClick={() => handleSubmit(document.getElementById("symbol").innerText, "14")}>2w</button>
        <button onClick={() => handleSubmit(document.getElementById("symbol").innerText, "30")}>1m</button>
        <button onClick={() => handleSubmit(document.getElementById("symbol").innerText, "180")}>6m</button>
        <button onClick={() => handleSubmit(document.getElementById("symbol").innerText, "360")}>1y</button>      
      </div>
      </div>
    )}
    </main>
    <aside>
      <div onClick={() => handleSubmit("^GSPC", "7")} class="aside_panel aside_right">
        <h3>S&P 500</h3>
        { dataAside != null && (
        <div class="panel">
          <h4 style={{color: dataAside.data.list[0][0] > dataAside.data.list[0][1] ? 'green' : 'red' }}>{dataAside.data.list[0][0]}</h4>
          <h4 style={{color: dataAside.data.list[0][0] > dataAside.data.list[0][1] ? 'green' : 'red' }}>{((dataAside.data.list[0][0] - dataAside.data.list[0][1]) / dataAside.data.list[0][1] * 100).toFixed(2)}%</h4>
        </div>
        )}
        {dataAside != null && <AsideChart dataAside={dataAside} index={0} />}
      </div>
      <div onClick={() => handleSubmit("^DJI", "7")} class="aside_panel aside_right">
        <h3>Dow 30</h3>
        { dataAside != null && (
        <div class="panel">
          <h4 style={{color: dataAside.data.list[1][0] > dataAside.data.list[1][1] ? 'green' : 'red' }}>{dataAside.data.list[1][0]}</h4>
          <h4 style={{color: dataAside.data.list[1][0] > dataAside.data.list[1][1] ? 'green' : 'red' }}>{((dataAside.data.list[1][0] - dataAside.data.list[1][1]) / dataAside.data.list[1][1] * 100).toFixed(2)}%</h4>
        </div>
        )}
        {dataAside != null && <AsideChart dataAside={dataAside} index={1} />}
      </div>
      <div onClick={() => handleSubmit("^IXIC","7")} class="aside_panel aside_right">
        <h3>Nasdaq</h3>
        { dataAside != null && (
        <div class="panel">
          <h4 style={{color: dataAside.data.list[2][0] > dataAside.data.list[2][1] ? 'green' : 'red' }}>{dataAside.data.list[2][0]}</h4>
          <h4 style={{color: dataAside.data.list[2][0] > dataAside.data.list[2][1] ? 'green' : 'red' }}>{((dataAside.data.list[2][0] - dataAside.data.list[2][1]) / dataAside.data.list[2][1] * 100).toFixed(2)}%</h4>
        </div>
        )}
        {dataAside != null && <AsideChart dataAside={dataAside} index={2} />}
      </div>
    </aside>
    </section>
    </>
  )
}

export default App
