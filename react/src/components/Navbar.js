import React, { useState, useEffect  } from 'react';
import { Link, NavLink, useNavigate,useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Admin } from '../page/Admin'
import './css/Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { auth_user, username,token,role } = useAuth();
  const  logout = () =>{
    localStorage.removeItem("token")
  }
  useEffect(() => {
    if(location.pathname === "/Signin")
    {
      navigate('/Signin');
      return
    }
    else if(location.pathname === "/")
    {
      navigate('/');
      return
    }
    if (!token) {
      navigate('/login');
      return
    } else{
      auth_user();
    }

    console.log(role)
  }, [location, navigate, token]);

  return (
    <>
      <nav className='Navbar'>
        <Link className='title'>STONK</Link>
        <div className='menu' onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={menuOpen ? 'open' : ''}>
          {/* เพิ่มเงื่อนไขเช็คว่ามีบทบาทเป็น admin หรือไม่ */}
          {role === 'admin' && (
            <>
            <li><NavLink to="/Admin">ALLOW PORT</NavLink></li>
            <li><NavLink to="/management">SLIP CHECK</NavLink></li>
            </>
          )}
          {role === 'user' && (
              <>
                <li><NavLink to="/Download_Bot">Download_Bot</NavLink></li>
                <li><NavLink to="/payments">Payment</NavLink></li>
                <li><NavLink to="/Dashboard">Dashboard</NavLink></li>
              </>
          )}
          {token? (
             <>
              <li><NavLink to="/" onClick={logout}>Logout</NavLink></li>
            </>
          ) : (
            <li><NavLink to="/login">Login/SignUp</NavLink></li>
          )}
        </ul>
      </nav>
    </>
  );
  
}
export default Navbar;
