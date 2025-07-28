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
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion } from "motion/react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

function App() {
  const [symbol, setSymbol] = useState();
  const [data, setData] = useState();
  const [info, setInfo] = useState();
  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:8080"
  const PHP_URL = "https://brunos.ct.ws/stocklens/"

  const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  }

  const Heart = async() => {
    await fetch(PHP_URL + "save_favorite.php", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({symbol: symbol}),
      credentials: 'include'
    })
    .then((res) => res.text())
    .then((data) => {
      console.log(data)
    })
    if (document.getElementById("heart").innerText == "🤍"){
      document.getElementById("heart").innerText = "💛"
    }
    else {
      document.getElementById("heart").innerText = "🤍"
    }
  }

  async function search(symbol) {
    if (event.keyCode == 13){
      await fetch(PHP_URL + "save_symbol.php", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({symbol: symbol}),
        credentials: 'include'
      })
      .then((res) => res.text())
      .then((data) => {
        console.log(data)
      })
      .then(() => {
        open("stock.html", "_self")
      })
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
            <YAxis domain={['auto', 'auto']} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="close"
              type="natural"
              stroke="var(--color-desktop)"
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
    const search = await axios.post(API_URL, { symbol: symbol, range: rangeDays});
    console.log(search.data.historyData);
    const formatted = search.data.historyData.map(item => ({
        date: item.date.slice(0,10),
        close: item.close
    }));
    setData(formatted.reverse());
    setInfo(search)
    setLoading(false)
  }

  const downloadSymbol = async() => {
    const res = await fetch(PHP_URL + "read_symbol.php", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    const data = await res.json()
    console.log(data)
    setSymbol(data.symbol)
  }

  const checkHeart = async() => {
    await fetch(PHP_URL + "read_favorites.php", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    .then((res) => res.text())
    .then((data) => {
      JSON.parse(data).symbol.forEach(async(element) => {
        console.log(symbol)
        console.log(element)
        if (element == symbol){
          document.getElementById("heart").innerText = "💛";
        }
      })
    })
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
    <div className='bg-stone-900 h-[100vh] flex justify-center'>
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
    </>
  )
}

export default App
