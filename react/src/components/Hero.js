import React from 'react'
import "./css/Hero.css"
import { Link } from 'react-router-dom'; // Import Link component
import arrow_btn from '../asset/arrow_btn.png'
import play_icon from '../asset/play_icon.png'
import pause_icon from '../asset/pause_icon.png'
const Hero = ({heroData,setHeroCount,heroCount,setPlayStatus,playStatus}) => {
  return (
    <div className='hero'>
      <div className="hero-text">
        <p>{heroData.text1}</p>
        <p>{heroData.text2}</p>
      </div>
       {/* Use Link instead of div */}
       <Link to="/login" className="hero-explore">
        <p>Getting Started</p>
        <img src={arrow_btn} className='arrow_btn' />
      </Link>
      <div className="hero-dot-play">
        <ul className="hero-dots">
          <li onClick={()=>setHeroCount(0)} className={heroCount == 0?"hero-dot orange" : "hero-dot"}></li>
          <li onClick={()=>setHeroCount(1)} className={heroCount == 1?"hero-dot orange" : "hero-dot"}></li>
          <li onClick={()=>setHeroCount(2)} className={heroCount == 2?"hero-dot orange" : "hero-dot"}></li>
        </ul>
        <div className="hero-play">
          <img onClick={()=>setPlayStatus(!playStatus)} src={playStatus?pause_icon:play_icon} class="playicon" />
          <p>See the video</p>
        </div>
      </div>
    </div>
  )
}
export default Hero