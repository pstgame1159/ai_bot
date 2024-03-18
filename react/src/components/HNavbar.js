import React from 'react'
import './css/HNavbar.css'
import { NavLink } from 'react-router-dom';
const HNavbar = () => {
  return (
    <div className='nav'>
      <div className='nav-logo'></div>
      <ul className='nav-menu'>
        <li className='nav-contact'><NavLink to="/login">Login</NavLink></li>
      </ul>
    </div>
  )
}
export default HNavbar