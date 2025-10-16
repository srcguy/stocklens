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
import { Badge } from "@/components/ui/badge"
import { motion } from "motion/react"

function App() {
  const [data, setData] = useState();
  const [dataFav, setDataFav] = useState();
  const [dataWall, setDataWall] = useState();
  if (localStorage.getItem("favorites") == null){
    localStorage.setItem("favorites", JSON.stringify([]))
  }
  if (localStorage.getItem("wallets") == null){
    localStorage.setItem("wallets", JSON.stringify([]))
  }
  const API_URL = "https://stocklens-5fqm.onrender.com/"
  const PHP_URL = "http://localhost/stocklens/"

  const search = async(symbol, nonEnter) => {
    if (event.keyCode == 13 || nonEnter){
      localStorage.setItem("symbol", symbol)
      open("/stock.html")
    }
  }

  const handleSubmit = async(type) => {
    const download = await axios.post(API_URL+type, {});
    console.log(download);
    let returnValue = [];
    for (let i = 0; i < 12; i += 4){
      const group = download.data.dataList.slice(i, i + 4).map((x, j) => (
        <div key={i + j} style={{cursor: "pointer"}} className="bg-stone-800 h-[20vh] w-[15vw] rounded-lg grid grid-row-3" onClick={function(e){search(x[3], true)}}><p className="text-stone-50 pt-5 pl-5 text-[1.8vh]">{x[2]}&nbsp;<Badge variant="default" className="text-[1.2vh]">{x[3]}</Badge></p><p className={x[0] > x[1] ? "text-green-700 pl-5 text-[4vh] font-medium" : "text-red-600 pl-5 text-[4vh] font-medium"}>{x[0].toFixed(2)}</p><p className="text-stone-50 pl-5 text-[2vh]"><span className={x[0] > x[1] ? "text-green-700" : "text-red-600"}>{x[0] > x[1] ? "↑" : "↓"}{(((x[0] - x[1]) / x[1]) * 100).toFixed(2)}%</span> <span className={x[0] > x[1] ? "text-green-700" : "text-red-600"}>{x[0] > x[1] ? "+" : ""}{(x[0] - x[1]).toFixed(2)}$</span></p></div>
      ));
      returnValue.push(
        <div key={100 + i} className='bg-stone-900 h-[25vh] flex gap-10 justify-center'>
          {group}
        </div>
      )
    }
    setData(returnValue);
  }

  const downloadFav = async() => {
    var datas = [];
    let returnValue = [];
    const data = JSON.parse(localStorage.getItem("favorites"))
    console.log(data)
    for(const element of data) {
      console.log(element)
      let download = await axios.post(API_URL+"fav", {symbol: element});
      //console.log(download)
      datas.push(download.data)
    }
    console.log(datas)
    for (let i = 0; i <= datas.length; i += 4){
      const group = datas.slice(i, i + 4).map((x, j) => (
        <div key={i + j} style={{cursor: "pointer"}} className="bg-stone-800 h-[20vh] w-[15vw] rounded-lg grid grid-row-3" onClick={function(e){search(x.symbol, true)}}><p className="text-stone-50 pt-5 pl-5 text-[1.8vh]">{x.companyName}&nbsp;<Badge variant="default" className="text-[1.2vh]">{x.symbol}</Badge></p><p className={x.currentPrice > x.previousClose ? "text-green-700 pl-5 text-[4vh] font-medium" : "text-red-600 pl-5 text-[4vh] font-medium"}>{x.currentPrice}</p><p className="text-stone-50 pl-5 text-[2vh]"><span className={x.currentPrice > x.previousClose ? "text-green-700" : "text-red-600"}>{x.currentPrice > x.previousClose ? "↑" : "↓"}{(((x.currentPrice - x.previousClose) / x.previousClose) * 100).toFixed(2)}%</span> <span className={x.currentPrice > x.previousClose ? "text-green-700" : "text-red-600"}>{x.currentPrice > x.previousClose ? "+" : ""}{(x.currentPrice - x.previousClose).toFixed(2)}$</span></p></div>
      ));
      returnValue.push(
        <div key={100 + i} className='bg-stone-900 h-[25vh] flex gap-10 justify-center'>
          {group}
        </div>
      )
      console.log(i) 
    }
    setDataFav(returnValue);
  }

  const downloadWall = async() => {
    var datas = [];
    let returnValue = [];
    const data = JSON.parse(localStorage.getItem("wallets"))
    console.log(data)
    for(const element of data) {
      console.log(element.symbols)
      for (const symbol of element.symbols){
        let download = await axios.post(API_URL+"fav", {symbol: symbol});
        datas.push(download.data)
      }
      returnValue.push(
        <div className='bg-stone-900 h-[12vh] flex justify-center'>
          <p className='text-[2vw] font-bold text-stone-50'>{element.title}</p>
        </div>
      )
      for (let i = 0; i <= datas.length; i += 4){
        const group = datas.slice(i, i + 4).map((x, j) => (
          <div key={i + j} style={{cursor: "pointer"}} className="bg-stone-800 h-[20vh] w-[15vw] rounded-lg grid grid-row-3" onClick={function(e){search(x.symbol, true)}}><p className="text-stone-50 pt-5 pl-5 text-[1.8vh]">{x.companyName}&nbsp;<Badge variant="default" className="text-[1.2vh]">{x.symbol}</Badge></p><p className={x.currentPrice > x.previousClose ? "text-green-700 pl-5 text-[4vh] font-medium" : "text-red-600 pl-5 text-[4vh] font-medium"}>{x.currentPrice}</p><p className="text-stone-50 pl-5 text-[2vh]"><span className={x.currentPrice > x.previousClose ? "text-green-700" : "text-red-600"}>{x.currentPrice > x.previousClose ? "↑" : "↓"}{(((x.currentPrice - x.previousClose) / x.previousClose) * 100).toFixed(2)}%</span> <span className={x.currentPrice > x.previousClose ? "text-green-700" : "text-red-600"}>{x.currentPrice > x.previousClose ? "+" : ""}{(x.currentPrice - x.previousClose).toFixed(2)}$</span></p></div>
        ));
        returnValue.push(
          <div key={100 + i} className='bg-stone-900 h-[25vh] flex gap-10 justify-center'>
            {group}
          </div>
        )
        console.log(i) 
      }
      datas = [];
    }
    setDataWall(returnValue);
  }

  useEffect(() => {
    downloadFav();
    downloadWall();
    let tempValue = [];
    tempValue.push(
      <div className='bg-stone-900 h-[10vh] flex gap-10 justify-center'>
          <p className='text-[2em] text-white'>If stocks don't show up, wait a moment! Server is probably starting</p>        
      </div>
      )
    setData(tempValue)
  }, [])

  return (
    <>
    <div className='bg-stone-900 h-[10vh] flex justify-center'>
      <div className='mt-10'>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink className="bg-stone-800 text-stone-50 mr-3">
              <motion.p className='text-[1vw]' onClick={() => handleSubmit("indexes")} whileHover={{cursor: "pointer", scale: 1.1}}>Indices</motion.p>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className="bg-stone-800 text-stone-50 mr-3">
              <motion.p className='text-[1vw]' onClick={() => handleSubmit("trending")} whileHover={{cursor: "pointer", scale: 1.1}}>Trending</motion.p>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className="bg-stone-800 text-stone-50 mr-3">
              <motion.p className='text-[1vw]' onClick={() => handleSubmit("crypto")} whileHover={{cursor: "pointer", scale: 1.1}}>Crypto</motion.p>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className="bg-stone-800 text-stone-50">
              <motion.p className='text-[1vw]' onClick={() => handleSubmit("currencies")} whileHover={{cursor: "pointer", scale: 1.1}}>Currencies</motion.p>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      </div>
    </div>
    <div className='bg-stone-900 h-[15vh] flex flex-rows justify-center'>
      <input onKeyDown={() => search(document.getElementById("search").value)} id="search" type="text" placeholder='Search...' className='bg-stone-800 text-stone-50 h-[5vh] w-[15vw] mt-10 pl-3 rounded-lg'></input>
    </div>
    {data}
    <div className='bg-stone-900 h-[12vh] flex justify-center'>
      <p className='text-[2vw] font-bold text-stone-50'>Favorites</p>
    </div>
    {dataFav}
    {dataWall}
    <div className='bg-stone-900 h-[10vh] flex gap-10 justify-center'>
      <p className="text-[1vw] text-stone-800 content-center">&copy; Bruno Szewczyk 2025</p>
    </div>
    </>
  )
}

export default App
//szarałt seba