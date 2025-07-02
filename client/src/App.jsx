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
  const [loading, setLoading] = useState(true);
  var rangeDays = 5;

  function rangeChange(symbolGet) {
    if (event.keyCode == 13)
    {
      if (document.getElementById("days") != null && document.getElementById("days").value != ''){
        rangeDays = document.getElementById("days").value;
        handleSubmit(symbolGet, rangeDays)
      }
    }
  }
  
  const handleSubmit = async(symbolGet, rangeDays) => {
    if (rangeDays == ''){
      rangeDays = "7";
    }
    const search = await axios.post('http://localhost:8080', { symbol: symbolGet, range: rangeDays});
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const search = await axios.post('http://localhost:8080/aside', {});
      console.log(search);
      setDataAside(search)
      setLoading(false)
    }
    fetchData();
    const fetchData2 = async () => {
      const search = await axios.post('http://localhost:8080/aside', {});
      console.log(search);
      setDataAside(search)
    }
    setInterval(async() => fetchData2(), 5000)
  }, [])
  return (
    <>
    <div id="bar">
      <h1>Stocklens</h1>
      <div id="empty"></div>
      <input type='text' class="search" id="search" name="search" placeholder='Symbol...'></input>
      <button onClick={() => handleSubmit(document.getElementById("search").value.toUpperCase(), "7")} id="search_button">🔎</button>
    </div>
    <section>
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
    {data != null && (
        <ResponsiveContainer id="chart" width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="1 3" />
            <XAxis dataKey="date" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="close" stroke="gray" dot={true} />
          </LineChart>
        </ResponsiveContainer>
      )}
    { info && (
      <div id="panel_bottom">
        <h3>Previous close: {info.data.previousClose} {info.data.currency}</h3>
        <h3>Daily range: {info.data.low} {info.data.currency} - {info.data.high} {info.data.currency}</h3>
        <h3>Market cap.: {info.data.capitalization} {info.data.currency}</h3>
      </div>
    )}
    </main>
    <aside>
      <div onClick={() => handleSubmit("^GSPC", "7")} class="aside_panel">
        <h3>S&P 500</h3>
        { loading == false && (
        <div class="panel">
          <h4 style={{color: dataAside.data.list[0][0] > dataAside.data.list[0][1] ? 'green' : 'red' }} dot={false}>{dataAside.data.list[0][0]}</h4>
          <h4 style={{color: dataAside.data.list[0][0] > dataAside.data.list[0][1] ? 'green' : 'red' }} dot={false}>{((dataAside.data.list[0][0] - dataAside.data.list[0][1]) / dataAside.data.list[0][1] * 100).toFixed(2)}%</h4>
        </div>
        )}
        {dataAside != null && (
        <ResponsiveContainer id="chart" width="100%" height={50}>
          <LineChart data={dataAside.data.list[0][3]}>
            <XAxis dataKey="date" hide={true}/>
            <YAxis domain={['auto', 'auto']} hide={true}/>
            <Line type="monotone" dataKey="close" stroke={dataAside.data.list[0][0] > dataAside.data.list[0][1] ? 'green' : 'red' } dot={false}/>
          </LineChart>
        </ResponsiveContainer>
        )}
      </div>
      <div onClick={() => handleSubmit("^DJI", "7")} class="aside_panel">
        <h3>Dow 30</h3>
        { loading == false && (
        <div class="panel">
          <h4 style={{color: dataAside.data.list[1][0] > dataAside.data.list[1][1] ? 'green' : 'red' }} dot={false}>{dataAside.data.list[1][0]}</h4>
          <h4 style={{color: dataAside.data.list[1][0] > dataAside.data.list[1][1] ? 'green' : 'red' }} dot={false}>{((dataAside.data.list[1][0] - dataAside.data.list[1][1]) / dataAside.data.list[1][1] * 100).toFixed(2)}%</h4>
        </div>
        )}
        {dataAside != null && (
        <ResponsiveContainer id="chart" width="100%" height={50}>
          <LineChart data={dataAside.data.list[1][3]}>
            <XAxis dataKey="date" hide={true}/>
            <YAxis domain={['auto', 'auto']} hide={true}/>
            <Line type="monotone" dataKey="close" stroke={dataAside.data.list[1][0] > dataAside.data.list[1][1] ? 'green' : 'red' } dot={false}/>
          </LineChart>
        </ResponsiveContainer>
        )}
      </div>
      <div onClick={() => handleSubmit("^IXIC","7")} class="aside_panel">
        <h3>Nasdaq</h3>
        { loading == false && (
        <div class="panel">
          <h4 style={{color: dataAside.data.list[2][0] > dataAside.data.list[2][1] ? 'green' : 'red' }} dot={false}>{dataAside.data.list[2][0]}</h4>
          <h4 style={{color: dataAside.data.list[2][0] > dataAside.data.list[2][1] ? 'green' : 'red' }} dot={false}>{((dataAside.data.list[2][0] - dataAside.data.list[2][1]) / dataAside.data.list[2][1] * 100).toFixed(2)}%</h4>
        </div>
        )}
        {dataAside != null && (
        <ResponsiveContainer id="chart" width="100%" height={50}>
          <LineChart data={dataAside.data.list[2][3]}>
            <XAxis dataKey="date" hide={true}/>
            <YAxis domain={['auto', 'auto']} hide={true}/>
            <Line type="monotone" dataKey="close" stroke={dataAside.data.list[2][0] > dataAside.data.list[2][1] ? 'green' : 'red' } dot={false}/>
          </LineChart>
        </ResponsiveContainer>
        )}
      </div>
    </aside>
    </section>
    </>
  )
}

export default App
