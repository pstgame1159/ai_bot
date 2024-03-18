import React, { useState, useEffect } from 'react';
import './css/Payments.css'
import slip from '../asset/slip.png'
import { useAuth } from '../components/AuthContext';
import axios from 'axios'
import Modal from '../components/Modal';

import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Swal from 'sweetalert2';

function createData(port_number) {
  return {
    port_number,
  };
}
function Row(props) {
  const { rowgg, isChecked, handleCheckboxChange } = props;
  const [open, setOpen] = useState(false);
  const [payment_commission, setPayment_commission] = useState([]);
  const { customer_id} = useAuth();
  

  
  useEffect(() => {

    const payment = async (customer_id) => {
      try {

          const res = await axios.post(`${process.env.REACT_APP_NAME_URL}/paymentall`, { customer_id });
          if (res.data.status === "success") {
            setPayment_commission(res.data.data)
          }
      } catch (err) {
          console.log(err);
      }
    };

    payment(customer_id)

  
  }, [customer_id]);
  
  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <Checkbox
            checked={isChecked}
            onChange={() => setOpen(!open)}
            inputProps={{ 'aria-label': 'expand row' }}
          />
        </TableCell>
        <TableCell component="th" scope="row">
  {rowgg.port_number}
</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Commission
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                  <TableCell>Port</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell >Status</TableCell>
                    <TableCell>ACTION</TableCell>
                  </TableRow>
                </TableHead>
  <TableBody>
            {payment_commission.map((payment, index) => {
              if (payment.port_number === rowgg.port_number) {
                return (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">{payment.port_number}</TableCell>
                    <TableCell align="center">Commission for {payment.date_commission}</TableCell>
                    <TableCell align="center">{payment.commission_pay} $ TO THB</TableCell>
                    <TableCell align="center">
                      <span style={{ color: payment.status_commission === 0 ? 'red' : payment.status_commission === 1 ? 'green' : 'black' }}>
                        {payment.status_commission === 0 ? 'ยังไม่ชำระเงิน' : payment.status_commission === 1 ? 'สำเร็จ' : null}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
                    </TableCell>
                  </TableRow>
                );
              }
              return null;
            })}
          </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}



export const Payments = () => {
  const { customer_id} = useAuth();

  const [thbAmounts, setThbAmounts] = useState([]);
  const [checkedRows, setCheckedRows] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [portsuser, setPortsuser] = useState([]);
  const [payment_commission, setPayment_commission] = useState([]);
  const [Amout, setAmout] = useState();
  const [selectedPorts, setSelectedPorts] = useState([]);
  const { username} = useAuth();



  useEffect(() => {
    const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
    axios.get(apiUrl)
      .then(response => {
        const exchangeRate = response.data.rates.THB;
        const thbAmounts = totalAmount * exchangeRate;
        setThbAmounts(thbAmounts);
      })
      .catch(error => {
        console.error('Error fetching exchange rate:', error);
      });

  }, [selectedPorts]);

  
  useEffect(() => {
    const ports = async (customer_id) => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_NAME_URL}/ports`, { customer_id });
        if (res.data.status === "success") {
          setPortsuser(res.data.data);
          console.log(res.data.data)
        }
      } catch (err) {
        console.log(err);
      }
  };
    ports(customer_id);
  }, [customer_id]);
useEffect(() => {
    const payment = async (customer_id) => {
      try {
          const res = await axios.post(`${process.env.REACT_APP_NAME_URL}/paymentall`, { customer_id });
          if (res.data.status === "success") {
            setPayment_commission(res.data.data)
          }
      } catch (err) {
          console.log(err);
      }
    };
const updateuser = async (customer_id) => {
      try {
          const res = await axios.post(`${process.env.REACT_APP_NAME_URL}/updatuser`, { customer_id });
          if (res.data.status === "updateuser") {
              setAmout(res.data.customer.amout)
          }
      } catch (err) {
          console.log(err);
      }
    };
    payment(customer_id)
    updateuser(customer_id)

  }, [customer_id]);
  const handleSubmitcom = async () => {
    const make_payment= async () => {
      try {
        let amoutuser = (Amout-thbAmounts).toFixed(2);
        const res = await axios.put(`${process.env.REACT_APP_NAME_URL}/updatecommission`, { selectedPorts ,amoutuser,customer_id});
        Swal.fire({
          title: "Payment completed!",
          text: "ชำระเงินสำเร็จ",
          icon: "success"
        }).then(() => {
          window.location.reload();
          console.log(res.data)
        });
      } catch (err) {
          console.log(err);
      }
    };
    const confirmed = await Swal.fire({
      title: `Do you want to pay off the balance ? `,
      html: `
        <div style="text-align:center;">
          <img src="${slip}" class="swal2-image qr-pic" alt="slip" style="width: 100%; max-width: 250px;">
          <div>Do you want to pay the balance of : $ ? </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, pay it!"
    });
    if (confirmed.isConfirmed) {
        if(Amout-thbAmounts>0)
        {
          make_payment()
        }
        else{

          Swal.fire({
            title: "warning!",
            text: `ยอดเงินคงเหลือของท่านไม่เพียงพอ  ${(Amout-thbAmounts).toFixed(2)}`,
            icon: "warning"
          });

        }

    }


  };
    const handleCheckboxChange = (port_number) => {
    const isChecked = checkedRows[port_number];
    const commissionPay = payment_commission.find(item => item.port_number === port_number)?.commission_pay || 0;
    if (!isChecked) {
      const newTotal = parseFloat((totalAmount + commissionPay).toFixed(2)); 
      setTotalAmount(newTotal);
    } else {
      const newTotal = parseFloat((totalAmount - commissionPay).toFixed(2));
      setTotalAmount(newTotal);
    }
    const updatedCheckedRows = { ...checkedRows };
    if (!isChecked) {
      updatedCheckedRows[port_number] = true; 
      setSelectedPorts(prev => [...prev, port_number]);
    } else {
      delete updatedCheckedRows[port_number]; 
      setSelectedPorts(prev => prev.filter(port => port !== port_number));
    }
    setCheckedRows(updatedCheckedRows);
    const allChecked = Object.values(updatedCheckedRows).every(value => value);
    setSelectAllChecked(allChecked);

    const selectedPortNumbers = Object.keys(checkedRows).filter(port => checkedRows[port]);
  };
  
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const handleSelectAllChange = () => {
    const allChecked = !selectAllChecked;
    setSelectAllChecked(allChecked);
    
    const newCheckedRows = {};
    let newTotal = totalAmount;
    let newSelectedPorts = [];
  
    portsuser.forEach(row => {
      const commissionPay = payment_commission.find(item => item.port_number === row.port_number)?.commission_pay || 0;
      if (commissionPay !== 0) { // ตรวจสอบว่า commissionPay ไม่มีค่าเป็น 0 หรือไม่
        newCheckedRows[row.port_number] = allChecked; 
        if (allChecked) { 
          newSelectedPorts.push(row.port_number);
          if (!checkedRows[row.port_number]) { 
            newTotal += commissionPay;
          }
        } else {
          if (checkedRows[row.port_number]) { 
            newTotal -= commissionPay;
          }
        }
      }
    });
  
    setTotalAmount(parseFloat(newTotal.toFixed(2)));
    setCheckedRows(newCheckedRows);
    setSelectedPorts(newSelectedPorts);
  };
  

  return (
    <div className='main'>
      <div className='pay-container'>
      <h1>Payment</h1>
        {totalAmount >= 1 && (<img src={slip} className="qr-pic" alt="slip" />)}
        <div className="info">
          <h2>Username : {username} </h2>
          <h2>ยอดที่ต้องชำระ : {thbAmounts}</h2>
          <h2>ยอดคงเหลือในระบบ : {Amout}</h2>
        </div>
        <Modal />
        <div className='payment-table'>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox checked={selectAllChecked} onChange={handleSelectAllChange} />
                  </TableCell>
                  <TableCell align='left' style={{ width: '100%' }}>Port</TableCell>
                </TableRow>
              </TableHead>
             <TableBody align='left'>
              {portsuser && portsuser.map((row) => (
                <Row key={row.port_number} rowgg={row} isChecked={checkedRows[row.port_number] || false} handleCheckboxChange={() => handleCheckboxChange(row.port_number)} />
              ))}
            </TableBody>
            </Table>
          </TableContainer>
        </div>
        <span style={{display: 'inline-block',padding: '10px 20px',backgroundColor: '#4CAF50', color: 'white', fontSize: '16px',border: 'none',borderRadius: '5px',cursor: 'pointer',textDecoration: 'none',marginBottom:'70px', cursor: thbAmounts === 0 ? 'not-allowed' : 'pointer',}}onClick={thbAmounts !== 0 ? handleSubmitcom : null}>
          กดเพื่อชำระ
        </span>
      </div>
    </div>
  )
}
