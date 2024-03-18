import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import img from "../asset/stonk.png";
import './css/Dashboard.css';
import chip from '../asset/card chip.png';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import './css/Downloadbot.css';
import LoginCss from "./css/Login.module.css"
import Swal from 'sweetalert2';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const TradingViewWidget = () => {
    const container = useRef();

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
            {
                "autosize": true,
                "symbol": "NASDAQ:AAPL",
                "interval": "D",
                "timezone": "Etc/UTC",
                "theme": "light",
                "style": "1",
                "locale": "en",
                "enable_publishing": false,
                "allow_symbol_change": true,
                "calendar": false,
                "support_host": "https://www.tradingview.com"
            }`;
        container.current.appendChild(script);
    }, []);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
            <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
            <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a></div>
        </div>
    );
}

export const Dashboard = () => {
    const { customer_id, ports, portsuser, sumcommission_all, sumcommission } = useAuth();
    const queryParams = new URLSearchParams(window.location.search);
    let value_portnumber = queryParams.get('value');
    let portFound = portsuser.find(port => port.port_number === value_portnumber);
    let balance_port = portFound ? portFound.balance : null;
    let equity_port = portFound ? portFound.equity : null;
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate(); 
    const [portnumber,setPortnumber] = useState('');
    const [datacom,setDatacom] = useState([]);





    if (value_portnumber === null) {
        value_portnumber = portsuser.length > 0 ? portsuser[0].port_number : null;
        navigate('/Dashboard?value='+value_portnumber );
    }

    const handleItemClick = (index) => {
        setActiveIndex(index);
    };



    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    
    function inserPort(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('customer_id', customer_id);
        formData.append('portnumber', portnumber);
        formData.append('image', event.target.elements.image.files[0]); // Append the file
        
        axios.post(`${process.env.REACT_APP_NAME_URL}/insertport`, formData)
            .then(res => {
                if (res.data.status === "insert success") {
                    Swal.fire({
                        title: "INSERT Success",
                        text: "Port added successfully, waiting for verification !",
                        icon: "success"
                      });
                    //  handleClose();
                    ports(customer_id);
                } else {
                    console.log(res)
                }
            })
            .catch(err => {
                console.log(err)
            });
    }


    useEffect(() => {


        const historyport = async (customer_id,port_number) => {
            try {
                const res = await axios.post(`${process.env.REACT_APP_NAME_URL}/historyport`, { customer_id,port_number });
                if (res.data.status === "success") {
                  //sethistoryPortuser(res.data.data)
                  console.log(res.data.data)
                  setDatacom(res.data.data)
                }
            } catch (err) {
                console.log(err);
            }
          };
          historyport(customer_id,value_portnumber)
 }, [customer_id,value_portnumber]); 
 

  useEffect(() => {

       ports(customer_id);
       sumcommission(value_portnumber);
}, [customer_id]); 


    return (
        <div className='big'>
            <div className="container">
                <aside>
                    <div className='top'>
                        <div className="logo">
                            <img src={img} alt="Stonk Logo"/>
                            <h2>St<span className='danger'>onk</span></h2>
                        </div>
                        <div className="close" id='close-btn'>
                            <span className="material-symbols-outlined">arrow_back</span>
                        </div>
                    </div>
                
                    <div className="sidebar">
                      {portsuser.map((port, index) => (
                        <a key={index} className={value_portnumber === port.port_number ? 'active' : ''} href={`/Dashboard?value=${port.port_number}`} onClick={() => handleItemClick(index + 1)}>
                           <span className="material-symbols-outlined" style={{ color: port.status_port === 0 ? 'green' : (port.status_port === 2 ? 'orange' : 'red') }}>person</span>
                            <h3> <p>Port : {port.port_number}</p></h3>
                        </a>
                    ))}
                                       <Button variant="primary" className='card-btn' onClick={handleShow}>ADD PORT</Button>
                    </div>

                </aside>
                <main>
                    <h1>Dashboard</h1>
                    <div className='date'>
                        <input type='date'/>
                    </div>
                    <div className="insights">
                        {/*-------------------------Begin of Commission-------------------------*/}
                            <div className="Commission">
                                <a  href={`/Commission?value=${value_portnumber}`}>
                                <span className="material-symbols-outlined">payments</span>
                                <div className="middle">
                                    <div className='left'>
                                        <h1>Commission</h1>
                                        <h1>$ {sumcommission_all && sumcommission_all.length > 0 ? sumcommission_all[0].sum_commission : 'Loading...'}</h1>
                                    </div>
                                    <div className='progress'>
                                        <img className='chip' src={chip} alt="Chip"/>
                                    </div>
                                </div>
                                <div className="bottom">
                                    <small className='text-muted'>Waiting</small>
                                </div>
                                </a>
                            </div>

                        {/*-------------------------Begin of Commission-------------------------*/}
                        {/*-------------------------Begin of Port-------------------------*/}
                        <div className="Port">
                        <a  href={`/historyport?value=${value_portnumber}`}>
                            <span className="material-symbols-outlined chart">show_chart</span>
                            <div className="middle">
                                <div className='left'>
                                    <h1>จำนวน : Balance</h1>
                                    <h1>${balance_port}</h1>
                                </div>
                                <div className='progress'>
                                    <img className='chip' src={chip} alt="Chip"/>
                                    <div className='number'></div>
                                </div>
                            </div>
                            <div className="bottom">
                                <small className='text-muted bottom'>Latest</small>
                            </div>
                            </a>
                        </div>
                        {/*-------------------------Begin of Port-------------------------*/}
                         {/*-------------------------Begin of Equity-------------------------*/}
                         <div className="Equity">
                         <span class="material-symbols-outlined">monetization_on</span>
                            <div className="middle">
                                <div className='left'>
                                    <h1>จำนวน : Equity</h1>
                                    <h1>${equity_port}</h1>
                                </div>
                                <div className='progress'>
                                    <img className='chip' src={chip} alt="Chip"/>
                                    <div className='number'></div>
                                </div>
                            </div>
                            <div className="bottom">
                                <small className='text-muted bottom'>Latest</small>
                            </div>
                        </div>
                        {/*-------------------------Begin of Port-------------------------*/}
                    </div>
                    <div className="trading">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={datacom}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date_transaction" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="balance" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="equity" stroke="#82ca9d" />
                        </LineChart>
                        </ResponsiveContainer>
                    </div>
                </main>
            </div>


            <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>ADD TO Customer</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>     
                          <form className={LoginCss.form} onSubmit={inserPort} >
                              <label className={LoginCss.label} htmlFor="portnumber"><b>Portnumber</b></label>
                              <input className={LoginCss.input} type="file" name="image" required /> {/* File input */}
                              <input className={LoginCss.input} type="text" placeholder="Pornnumber" name="portnumber"  onChange={e => setPortnumber(e.target.value)}  required />
                              <button className={LoginCss.btn} type="submit" >Insert</button>
                          </form>
                </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>

        </div>



    );
}
