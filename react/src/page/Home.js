import React,{ useEffect, useState } from 'react';
import Background from '../components/Background'
import Hero from '../components/Hero';
  const Home = () => {
    let heroData =[
      {text1:"Dive into",text2:"What you love"},
      {text1:"Indulge ",text2:"your passion"},
      {text1:"Give in to",text2:"your passion"},
    ]
    const [heroCount,setHeroCount] = useState(0);
    const [playStatus,setPlayStatus] = useState(false);

    useEffect(()=>{
      setInterval(()=>{
        setHeroCount((count)=>{return count===2?0:count+1})
      },3000);
    },[])

    return (
      <div>
      <Background playStatus={playStatus} heroCount={heroCount}/>
      <Hero
        setPlayStatus={setPlayStatus}
        heroData={heroData[heroCount]}
        setHeroCount={setHeroCount}
        heroCount={heroCount}
        playStatus={playStatus}
      />
      </div>
    );
  };

  export default Home;
