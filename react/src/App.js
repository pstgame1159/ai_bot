import './App.css';
import { Route ,Routes, useLocation } from "react-router-dom"
import Home from './page/Home';
import { Management } from './page/Management'
import { Payment } from './page/Payment'
import { Payments } from './page/Payments'
import { Login } from './page/Login'
import { Signin } from './page/Signin';
import { Downloadbot } from './page/Downloadbot';
import { EurUsd } from './page/EurUsd';
import { Historyport } from './page/Historyport';
import { AuthProvider } from './components/AuthContext';
import { Admin } from './page/Admin';
import { Dashboard } from './page/Dashboard';
import { Commission } from './page/Commission';
import Navbar from './components/Navbar';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/Signin' || location.pathname === '/';

  return (
    <div className='App'>
      <AuthProvider>
        {!isLoginPage && <Navbar/>}
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/management" element={<Management/>} />
          <Route path="/Download_Bot" element={<Downloadbot/>} />
          <Route path="/payment" element={<Payment/>} />
          <Route path="/payments" element={<Payments/>} />
          <Route path="/login" element={<Login/>} />
          <Route path='/Signin' element={<Signin/>}/>
          <Route path='/historyport' element={<Historyport/>}/>
          <Route path="/EurUsd" element={<EurUsd/>}/>
          <Route path="/Dashboard" element={<Dashboard/>}/>
          <Route path="/Commission" element={<Commission/>}/>
          <Route path='/Admin' element={<Admin/>} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
