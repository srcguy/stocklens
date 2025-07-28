import { motion } from "motion/react"
import { useScroll, useMotionValueEvent, useTransform } from "motion/react"
import { useRef } from "react"

function App() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  useMotionValueEvent(scrollYProgress, "change" , (val) => {
    console.log(val)
    console.log(mt1.current)
  })
  
  const mt1 = useTransform(scrollYProgress, [0.30, 0.40], [1000, 200])
  const mt2 = useTransform(scrollYProgress, [0.40, 0.50], [1000, 200])
  const mt3 = useTransform(scrollYProgress, [0.50, 0.60], [1000, 200])

  return (
    <>
    <div className="bg-stone-950 h-[400vh] w-full flex flex-col" ref={ref}>
      <div className="w-full h-[100vh] grid grid-cols-1 content-center">
        <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: 2}}} className="pl-10">
          <h1 className="text-[4vw] text-slate-50 font-bold">Your journey with <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">stock market</span></h1>
          <h1 className="text-[4vw] text-slate-50 font-bold">begins here</h1>
        </motion.div>
      </div>
      <div className="sticky top-0 bg-stone-950 w-full h-[100vh] flex flex-row pt-10">
        <motion.div initial={{opacity: 0}} whileInView={{opacity: 1, transition: {duration: 2}}} className="flex flex-col pl-20">
          <div className="flex-2"></div>
          <p className="text-[3vw] text-stone-50 font-bold mt-10 w-190 flex-1 content-center">See the markets clearly.</p>
          <p className="text-[3vw] text-stone-50 font-bold w-190 mt-10 flex-1">Explore stocks, crypto and currencies.</p>
          <p className="text-[3vw] text-stone-50 font-bold w-190 mt-10 mb-10 flex-1">Track trends. Analyze smarter.</p>
          <div className="flex-3"></div>
        </motion.div>
        <div className="mt-5">
          <motion.img src="src/assets/screen1.png" 
          style={{marginTop: mt1}} 
          whileHover={{zIndex: 40, scale: 1.1, transition: {duration: 0.5}}} 
          className="absolute border-0 h-100 z-10 rounded-lg ml-30"/>
          <motion.img src="src/assets/screen2.png" 
          style={{marginTop: mt2}}
          whileHover={{zIndex: 40, scale: 1.1, transition: {duration: 0.5}}} 
          className="absolute border-0 h-100 mt-50 z-20 rounded-lg ml-30"/>
          <motion.img src="src/assets/screen3.png" 
          style={{marginTop: mt3}}
          whileHover={{zIndex: 40, scale: 1.1, transition: {duration: 0.5}}} 
          className="absolute border-0 h-100 mt-100 z-30 rounded-lg ml-30"/>
        </div>
      </div>
      <div className="bg-stone-950 w-full h-[100vh]">

      </div>
      <div className="relative bg-stone-950 w-full h-[100vh] flex flex-row">
        <div className="flex-1 content-center p-10">
          <motion.p className="text-[2vw] text-stone-50 font-bold p-10"
          initial={{scale: 0, opacity: 0}} 
          whileInView={{scale: 1, opacity: 1, transition: {duration: 1}}}>
          Follow major indices and company shares. Stay updated with real-time prices and market trends.</motion.p>
        </div>
        <div className="flex-1 content-center p-10">
          <motion.p className="text-[2vw] text-stone-50 font-bold p-10"
          initial={{scale: 0, opacity: 0}} 
          whileInView={{scale: 1, opacity: 1, transition: {duration: 1.5}}}>
          Monitor global exchange rates. Compare major currency pairs like USD/PLN and EUR/USD.</motion.p>
        </div>
        <div className="flex-1 content-center p-10">
          <motion.p className="text-[2vw] text-stone-50 font-bold p-10"
          initial={{scale: 0, opacity: 0}} 
          whileInView={{scale: 1, opacity: 1, transition: {duration: 2}}}>
          Track the most popular digital assets. Stay ahead with live data on Bitcoin, Ethereum, and more.</motion.p>
        </div>
      </div>
    </div>
    <div className="bg-stone-950 w-full h-[100vh] flex flex-col place-content-center gap-30 pb-20">
      <p className="text-[3vw] text-stone-50 font-bold w-190 content-center text-center ml-135">Stay informed, explore trends, and make smarter decisions.</p>
      <motion.p className="text-[3vw] text-green-500 font-bold w-190 content-center text-center ml-135"
      initial={{scale: 0}} 
      whileInView={{scale: 1, transition: {type: "spring", stiffness: 2000, damping: 60, mass: 5}}}
      >For free</motion.p>
      <a href="chart.html"><motion.button className="bg-gradient-to-r from-pink-500 to-violet-500 h-20 w-100 ml-180"
      whileHover={{scale: 1.1, cursor: "pointer", transition: {duration: 0.5}}}
      whileTap={{scale: 0.9}}>
        <p className="text-[2vw] font-bold">Start now!</p>
      </motion.button></a>
    </div>
    </>
  )
}

export default App
