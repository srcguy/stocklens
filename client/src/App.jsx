import axios from 'axios';
import './index.css'
import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

function App() {
  const [data, setData] = useState(null);
  const [info, setInfo] = useState(null);

  const handleSubmit = async() => {
    var rangeDays = 5;
    if (document.getElementById("days") != null){
      rangeDays = document.getElementById("days").value;
    }
    const search = await axios.post('http://localhost:8080', { symbol: document.getElementById("search").value.toUpperCase(), range: rangeDays});
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
  return (
    <>
    <div id="bar">
      <h1>Stocklens</h1>
      <div id="empty"></div>
      <input type='text' class="search" id="search" name="search" placeholder='Symbol...'></input>
      <button onClick={handleSubmit} id="search_button">🔎</button>
    </div>
    <main>
    { info && (
      <div id="panel">
        <h2 id="name">{info.data.companyName}</h2> 
        <h3 class="price" style={{ color: info.data.currentPrice > info.data.previousClose ? 'green' : 'red' }}>{info.data.currentPrice} {info.data.currency}</h3>
        <h4 class="percent" style={{ color: info.data.currentPrice > info.data.previousClose ? 'green' : 'red' }}>{((info.data.currentPrice - info.data.previousClose) / info.data.previousClose * 100).toFixed(2)}%</h4>
        <div id="empty"></div>
        <input type='text' class="days" id="days" name="days" placeholder='Range (in days)...'></input>
      </div>
    )}
    {data != null && (
        <ResponsiveContainer id="chart" width="90%" height={400}>
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
    </>
  )
}

export default App
