import React, { useState }from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import RegisterCss from "./css/Login.module.css"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
export const Signin = () => {
    const navigate = useNavigate();
    const [fullname,setfullname] = useState('');
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [errorsignin,setErrorsignin] = useState('');

    function Signin(event)
    {
        event.preventDefault();
        axios.post(`${process.env.REACT_APP_NAME_URL}/signin`,{fullname,username,password})
        .then(res =>{  
            if(res.data === "Values Inserted" )  
            {
                      
                Swal.fire({
                    title: "Success",
                    text: "สมัครสำเร็จ",
                    icon: "success"
                }).then(() => {
                    navigate('/login');
                });
                
            }
   
            setErrorsignin(res.data);
        })
        .catch(err=> {
            console.log(err)
            setErrorsignin(err.message)
        }
        );
    }
  return (
    <>
        <div className={RegisterCss.container}>
            <div className={RegisterCss.card}>
                <form className={RegisterCss.form} onSubmit={Signin}>
                <a  href="/" className={RegisterCss.icon}><FontAwesomeIcon icon={faArrowLeft}/></a>
                    <h2 className={RegisterCss.title}>Sign up</h2>
          
                    <label className={RegisterCss.label}><b>Full Name</b></label>
                    <input className={RegisterCss.input}  type="text" placeholder="Enter your Fullname" name="Fullname"   onChange={e => setfullname(e.target.value)}  required />

                    <label className={RegisterCss.label}><b>Username</b></label>
                    <input className={RegisterCss.input} type="text" placeholder="Enter Port" name="Username"   onChange={e=>setUsername(e.target.value)} required  />

                    <label className={RegisterCss.label}><b>Password</b></label>
                    <input className={RegisterCss.input} type="password" placeholder="Enter Password" name="psw" onChange={e=>setPassword(e.target.value)}  required />

                    <label className={RegisterCss.errorlabel} id="errorlabel"></label>
                    <button className={RegisterCss.btn} type="submit">Sign up</button>

                    <div  className={RegisterCss.switch}>Have account already? <a className={RegisterCss.a} href="/Login">Login</a></div>

                </form>
                <h4 style={{ color: 'red' }}>{errorsignin}</h4>
            </div>
        </div>
    </>
    
)
}
export default Signin;
