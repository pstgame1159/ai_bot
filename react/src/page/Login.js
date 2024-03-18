

import React, { useState }from 'react'
import LoginCss from "./css/Login.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
export const Login = () => {
    const navigate = useNavigate();

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [errorlogin,setErrorlogin] = useState('');
    function submitlogin(event)
    {
        event.preventDefault();
        axios.post(`${process.env.REACT_APP_NAME_URL}/login`,{username,password})
        .then(res =>{  
            if(res.data.status === "Success" )  
            {
                localStorage.setItem("token",res.data.token)
                if(res.data.customers.role == "user")
                {
                    navigate('/Dashboard')
                }
                else if(res.data.customers.role == "admin")
                {
                    navigate('/Admin')
                }
                
            }
   
            setErrorlogin(res.data);
        })
        .catch(err=> {
            console.log(err)
            setErrorlogin(err.message)
        }
        );
    }
  return (
    <>
        <div className={LoginCss.container}>
            <div className={LoginCss.card}>
                <form className={LoginCss.form} onSubmit={submitlogin} >
                    <a  href="/" className={LoginCss.icon}><FontAwesomeIcon icon={faArrowLeft}/></a>
                    <h2 className={LoginCss.title}>Login</h2>

                    <label className={LoginCss.label} htmlFor="uname"><b>E-mail</b></label>
                    <input className={LoginCss.input} type="text" placeholder="Enter E-mail" name="uname"  onChange={e => setUsername(e.target.value)}  required />


                    <label className={LoginCss.label} htmlFor="psw"><b>Password</b></label>
                    <input className={LoginCss.input} type="password" placeholder="Enter Password" name="psw"  onChange={e=>setPassword(e.target.value)} required />

                    <label className={LoginCss.errorlabel} id="errorlabel"></label>
                    <button className={LoginCss.btn} type="submit" >Login</button>
                    
                    
                    <div className={LoginCss.switch}>Don't have an account? <a className={LoginCss.a}href="/Signin">Sign up</a></div>
                    
                </form>
    
                <h4 style={{ color: 'red' }}>{errorlogin}</h4>
            </div>
        </div>
    </>
);
}
