import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // เพิ่ม useNavigate นำเข้า

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate(); 
  const token = localStorage.getItem('token');

  const [username, setUsername] = useState("");
  const [role, setRoleuser] = useState("");
  const [customer_id, setCustomer_id] = useState("");
  const [Amout, setAmout] = useState();
  const [portsuser, setPortsuser] = useState([]);
  const [historyPortuser, sethistoryPortuser] = useState([]);
  const [payment_commission, setPayment_commission] = useState([]);
  const [sumcommission_all, setSumcommission] = useState([]);
  const [payment_count_all, setPayment_count] = useState([]);
 

  const updateuser = async (customer_id) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_NAME_URL}/updatuser`, { customer_id });
        if (res.data.status === "updateuser") {
            setUsername(res.data.customer.username)
            setCustomer_id(customer_id)
            setRoleuser(res.data.customer.role)
            setAmout(res.data.customer.amout)
        }
    } catch (err) {
        console.log(err);
    }
  };

  const auth_user = async () => {
    try {
      const result = await axios.post(`${process.env.REACT_APP_NAME_URL}/auth`, {}, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      
      if (result.data.status === 'error') {
        navigate('/login');
        localStorage.removeItem("token");
      } else {
        updateuser(result.data.decord_jwt.username.customer_id);
      }
    } catch (err) {
      console.log(err);
    }
  };


  const ports = async (customer_id) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_NAME_URL}/ports`, { customer_id });
        if (res.data.status === "success") {
          setPortsuser(res.data.data)
        }
    } catch (err) {
        console.log(err);
    }
  };
  const historyport = async (customer_id,port_number) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_NAME_URL}/historyport`, { customer_id,port_number });
        if (res.data.status === "success") {
          sethistoryPortuser(res.data.data)
          console.log(port_number)
        }
    } catch (err) {
        console.log(err);
    }
  };

  const payment = async (customer_id,port_number) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_NAME_URL}/payment`, { customer_id,port_number });
        if (res.data.status === "success") {
          setPayment_commission(res.data.data)
          console.log(res)
        }
    } catch (err) {
        console.log(err);
    }
  };
  const payment_count = async (customer_id) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_NAME_URL}/payment_count`, {customer_id});
        if (res.data.status === "success") {
          setPayment_count(res.data.data)
          //console.log(res)
        }
    } catch (err) {
        console.log(err);
    }
  };

  const sumcommission = async (port_number) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_NAME_URL}/sumcommission`, { port_number });
        if (res.data.status === "success") {
          setSumcommission(res.data.data)
        }
    } catch (err) {
        console.log(err);
    }
  };


  return (
    <AuthContext.Provider value={{ updateuser, auth_user,ports,historyport,payment,sumcommission,sumcommission_all,payment_count,payment_count_all, username, token,customer_id,portsuser,historyPortuser,payment_commission,Amout,role }}>
      {children}
    </AuthContext.Provider>
  );
};
