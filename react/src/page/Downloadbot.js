import * as React from 'react';
import './css/Downloadbot.css';
import Navbar from '../components/Navbar';
export const Downloadbot = () => {
  return (
    <div>
      <div className='card-container-wrapper'>
        <div className='card-container'>
          <img
            src="https://cfcdn-plus.olymptrade.com/fe/319_240222135719/bundle/images/pair-icon-gbpusd.img.svg"
            className='card-img'
          />
          <h1 className='card-title'>EUR/USD</h1>
          <p className='card-description'>  
            This is template for Euro to USD.</p>
          <a href="EurUsd" className='card-btn'><h2>More Detail</h2></a>
        </div>
        <div className='card-container'>
          <img 
          src="https://cfcdn-plus.olymptrade.com/fe/319_240222135719/bundle/images/pair-icon-audchf.img.svg"
          className='card-img'
          />
          <h1 className='card-title'>XAU/USD</h1>
          <p className='card-description'>
          This is template for Gold to USD.
          </p>
            <a href='cardPage' className='card-btn'><h2>More Detail</h2></a>
        </div>
        <div className='card-container'>
          <img 
          src="https://cfcdn-plus.olymptrade.com/fe/319_240222135719/bundle/images/pair-icon-audjpy.img.svg"
          className='card-img'
          />
          <h1 className='card-title'>XAU/USD</h1>
          <p className='card-description'>
          This is template for Gold to USD.
          </p>
            <a href='cardPage' className='card-btn'><h2>More Detail</h2></a>
        </div>
        <div className='card-container'>
          <img 
          src="https://cfcdn-plus.olymptrade.com/fe/319_240222135719/bundle/images/pair-icon-audusd.img.svg"
          className='card-img'
          />
          <h1 className='card-title'>XAU/USD</h1>
          <p className='card-description'>
          This is template for Gold to USD.
          </p>
            <a href='cardPage' className='card-btn'><h2>More Detail</h2></a>
        </div>    
        <div className='card-container'>
          <img 
          src="https://cfcdn-plus.olymptrade.com/fe/319_240222135719/bundle/images/pair-icon-chfjpy.img.svg"
          className='card-img'
          />
          <h1 className='card-title'>XAU/USD</h1>
          <p className='card-description'>  
          This is template for Gold to USD.
          </p>
            <a href='cardPage' className='card-btn'><h2>More Detail</h2></a>
        </div>
        <div className='card-container'>
          <img 
          src="https://cfcdn-plus.olymptrade.com/fe/319_240222135719/bundle/images/pair-icon-cadchf.img.svg "
          className='card-img'
          />
          <h1 className='card-title'>XAU/USD</h1>
          <p className='card-description'>
          This is template for Gold to USD.
          </p>
            <a href='cardPage' className='card-btn'><h2>More Detail</h2></a>
        </div>

        <div className='card-container'>
          <img 
          src="https://cfcdn-plus.olymptrade.com/fe/319_240222135719/bundle/images/pair-icon-eurchf.img.svg"
          className='card-img'
          />
          <h1 className='card-title'>XAU/USD</h1>
          <p className='card-description'>
          This is template for Gold to USD.
          </p>
            <a href='cardPage' className='card-btn'><h2>More Detail</h2></a>
        </div>
        <div className='card-container'>
          <img 
          src="https://cfcdn-plus.olymptrade.com/fe/319_240222135719/bundle/images/pair-icon-xauusd.img.svg"
          className='card-img'
          />
          <h1 className='card-title'>XAU/USD</h1>
          <p className='card-description'>
          This is template for Gold to USD.
          </p>
            <a href='cardPage' className='card-btn'><h2>More Detail</h2></a>
        </div>

      </div>
    </div>
  );

}