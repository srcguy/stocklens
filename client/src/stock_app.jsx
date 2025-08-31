import axios from 'axios';
import { React, useEffect, useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { motion } from "motion/react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

function App() {
  const [symbol, setSymbol] = useState();
  const [dataMain, setDataMain] = useState();
  const [dataCompare, setDataCompare] = useState();
  const [data, setData] = useState();
  const [info, setInfo] = useState();
  const [range, setRange] = useState();
  const [loading, setLoading] = useState(true);
  const API_URL = "https://stocklens-5fqm.onrender.com"
  const PHP_URL = "http://localhost/stocklens/"

  const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  }

  const Heart = async() => {
    let list = JSON.parse(localStorage.getItem("favorites"))
    if (list != null && list.includes(symbol)){
      var index = list.indexOf(symbol);
      if (index !== -1) {
        list.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(list))
      }
    }
    else {
      list.push(symbol)
      localStorage.setItem("favorites", JSON.stringify(list))
    }
    if (document.getElementById("heart").innerText == "🤍"){
      document.getElementById("heart").innerText = "💛"
    }
    else {
      document.getElementById("heart").innerText = "🤍"
    }
  }

  async function search(symbol) {
    if (event.keyCode == 13){
      localStorage.setItem("symbol", symbol)
      open("stock.html", "_self")
    }
  }

  async function compare(symbol) {
    if (event.keyCode == 13){
      let rangeDays = range
      if (range == ''){
        rangeDays = "7";
      }
      const search = await axios.post(API_URL, { symbol: symbol, range: rangeDays})
      const formatted = search.data.historyData.map(item => ({
          close2: item.close
      }));
      setDataCompare(formatted);
      setLoading(false)
      let n = 0
      for (const obj of data){
        console.log(obj)
        obj.close2 = formatted[n].close2
        n++
      }
      console.log(data)
      Chart(data)
    }
  }

  function Chart({data}){
    return(
      <ChartContainer config={chartConfig} className="mt-6">
        <LineChart
          accessibilityLayer
          data={data}
          margin={{
            left: 12,
            right: 12,
          }}
        > 
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis yAxisId="left" domain={['auto', 'auto']} />
        <YAxis yAxisId="right" domain={['auto', 'auto']} orientation='right'/>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        <Line
          yAxisId="left"
          dataKey="close"
          type="natural"
          stroke="#DE4A1F"
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="right"
          dataKey="close2"
          type="natural"
          stroke="#1F6FDE"
          strokeWidth={2}
          dot={false}
        />
        </LineChart>
      </ChartContainer>
    )
  }

  const downloadData = async(rangeDays) => {
    if (rangeDays == ''){
      rangeDays = "7";
    }
    setRange(rangeDays)
    const search = await axios.post(API_URL, { symbol: symbol, range: rangeDays});
    console.log(search.data.historyData);
    const formatted = search.data.historyData.map(item => ({
        date: item.date.slice(0,10),
        close: item.close
    }));
    console.log(formatted.reverse())
    setDataMain(formatted.reverse());
    setData(formatted.reverse())
    setInfo(search)
    setLoading(false)
  }

  const downloadSymbol = async() => {
    setSymbol(localStorage.getItem("symbol"))
  }

  const checkHeart = async() => {
    if (localStorage.getItem("favorites") != null){
      const list = JSON.parse(localStorage.getItem("favorites"))
      list.forEach(async(element) => {
        console.log(element)
        if (element == symbol){
          document.getElementById("heart").innerText = "💛";
        }
      })
    }
  }

  useEffect(() => {
    downloadSymbol();
  }, []);

  useEffect(() => {
    if (symbol) {
      downloadData();
    }
  }, [symbol]);
  
  useEffect(() => {
    if(loading == false){
      checkHeart();
    }
  }, [loading])

  if (loading) {
    return (
      <>
      <div className='bg-stone-900 h-[100vh] flex justify-center'>
        <p className='text-stone-50'>Loading...</p>
      </div>
      </>
    )
  }

  const date = new Date();
  console.log(info)
  const pChange = parseFloat(((info.data.currentPrice - info.data.previousClose) / info.data.previousClose) * 100).toFixed(2)
  const change = parseFloat(info.data.currentPrice - info.data.previousClose).toFixed(2)

  return (
    <>
    <div className='bg-stone-900 flex justify-center'>
      <input onKeyDown={() => search(document.getElementById("search").value)} id="search" type="text" placeholder='Search...' className='bg-stone-800 text-stone-50 h-[5vh] w-[15vw] pl-3 rounded-lg mt-10 mb-8'></input>
    </div>
    <div className='bg-stone-900 h-[75vh] flex justify-center'>
      <div className='w-[50vw]'>
        <p id="name" className='text-[3vw] text-stone-50 font-bold'>{info.data.companyName} <span className='text-[2vw]'>{info.data.currentPrice}</span> <span className={parseFloat(pChange) > 0 ? "text-[1.5vw] text-green-700" : "text-[1.5vw] text-red-600"}>{pChange}%</span> <span className={parseFloat(change) > 0 ? "text-[1.5vw] text-green-700" : "text-[1.5vw] text-red-600"}>{change}</span></p>
        <NavigationMenu className="mt-2">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink className="bg-stone-800 text-stone-50 mr-3" onClick={() => downloadData("14")}>
                <motion.p className='text-[1vw]' whileHover={{cursor: "pointer", scale: 1.1}}>2W</motion.p>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="bg-stone-800 text-stone-50 mr-3" onClick={() => downloadData("30")}>
                <motion.p className='text-[1vw]' whileHover={{cursor: "pointer", scale: 1.1}}>1M</motion.p>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="bg-stone-800 text-stone-50 mr-3" onClick={() => downloadData("180")}>
                <motion.p className='text-[1vw]' whileHover={{cursor: "pointer", scale: 1.1}}>6M</motion.p>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="bg-stone-800 text-stone-50  mr-3" onClick={() => downloadData(Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24))}>
                <motion.p className='text-[1vw]' whileHover={{cursor: "pointer", scale: 1.1}}>YTD</motion.p>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="bg-stone-800 text-stone-50  mr-3" onClick={() => downloadData("365")}>
                <motion.p className='text-[1vw]' whileHover={{cursor: "pointer", scale: 1.1}}>1Y</motion.p>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="bg-stone-800 text-stone-50 mr-2" onClick={() => downloadData("1825")}>
                <motion.p className='text-[1vw]' whileHover={{cursor: "pointer", scale: 1.1}}>5Y</motion.p>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="text-stone-50 mr-3">
                <motion.p id="heart" onClick={() => Heart()} className='text-[1.2vw]' whileHover={{cursor: "pointer", scale: 1.2}}>🤍</motion.p>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {<Chart data={data}/>}

      </div>
      <div className='ml-20 mt-8'>
        <table className='text-[1.2vw] text-stone-50'>
          <tr>
            <td className='pb-2'>Previous close</td>
            <td className='pb-2 pl-2'>{info.data.currency}{info.data.previousClose}</td>
          </tr>
          <tr>
            <td className='pb-2'>Day range</td>
            <td className='pb-2 pl-2'>{info.data.currency}{parseFloat(info.data.low).toFixed(2)} - {info.data.currency}{parseFloat(info.data.high).toFixed(2)}</td>
          </tr>
          <tr>
            <td className='pb-2'>Market cap</td>
            <td className='pb-2 pl-2'>{Intl.NumberFormat('en-US', {notation: "compact",maximumFractionDigits: 1}).format(info.data.capitalization)} {info.data.currency}</td>
          </tr>
          <tr>
            <td className='pb-2'>AVG volume</td>
            <td className='pb-2 pl-2'>{Intl.NumberFormat('en-US', {notation: "compact",maximumFractionDigits: 1}).format(info.data.avgVolume)}</td>
          </tr>
          <tr>
            <td className='pb-2'>Dividend yield</td>
            <td className='pb-2 pl-2'>{parseFloat(100 * info.data.dividend).toFixed(2)}%</td>
          </tr>
          <tr>
            <td className='pb-2'>P/E ratio</td>
            <td className='pb-2 pl-2'>{parseFloat(info.data.pe).toFixed(2)}</td>
          </tr>
          <tr>
            <td className='pb-2'>Primary exchange</td>
            <td className='pb-2 pl-2'>{info.data.exchange}</td>
          </tr>
        </table>
      </div>
    </div>
    <div className='bg-stone-900 flex justify-center'>
      <input onKeyDown={() => compare(document.getElementById("compare").value)} id="compare" type="text" placeholder='Compare with...' className='bg-stone-800 text-stone-50 h-[5vh] w-[15vw] pl-3 rounded-lg mt-8 mb-20'></input>
    </div>
    </>
  )
}

export default App

