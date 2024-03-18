import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import slip from '../asset/slip.png'
import Swal from 'sweetalert2';

export const Commission = () => {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [portnumber,setPortnumber] = useState('');
  const {customer_id,payment,payment_commission } = useAuth();



  const [file, setFile] = useState(null);
  const [Amout, setAmout] = useState();
  const [thbAmounts, setThbAmounts] = useState([])














  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };


  useEffect(() => {
    const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
    axios.get(apiUrl)
      .then(response => {
        const exchangeRate = response.data.rates.THB;
        setThbAmounts(exchangeRate);
      })
      .catch(error => {
        console.error('Error fetching exchange rate:', error);
      });

  }, [thbAmounts]);

  useEffect(() => {
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
    updateuser(customer_id)

  }, [customer_id]);


  const handleSubmit = async (commissionPay,date_commission,selectedPorts, payamout) => {

    const confirmed = await Swal.fire({
      title: `Do you want to pay off the balance ? `,
      html: `
        <div style="text-align:center;">
          <img src="${slip}" class="swal2-image qr-pic" alt="slip" style="width: 100%; max-width: 250px;">
          <div>Do you want to pay the balance of : ${commissionPay}$ ? </div>
          <div>Date time you want to pay : ${date_commission} </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, pay it!"
    });
    if (confirmed.isConfirmed) {
      const make_payment= async () => {
        try {
          let amoutuser = (Amout-payamout).toFixed(2);
          const res = await axios.put(`${process.env.REACT_APP_NAME_URL}/updatecommission`, { selectedPorts ,amoutuser,customer_id });
           
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
      if(Amout-payamout>0)
      {
        console.log(Amout-payamout)
        make_payment()
      }
      else{

        Swal.fire({
          title: "warning!",
          text: `ยอดเงินคงเหลือของท่านไม่เพียงพอ  ${(Amout-payamout).toFixed(2)}`,
          icon: "warning"
        });
      }






    }
  };

  function convertToThaiBuddhistCalendar(dateString) {
    const date = new Date(dateString);
    const thaiYear = date.getFullYear() + 543; // เพิ่ม 543 เพื่อแปลงเป็นปีพุทธศักราช
    const thaiMonth = date.getMonth() + 1; // เดือนใน JavaScript เริ่มที่ 0 ต้องเพิ่ม 1 เพื่อให้ตรงกับเดือนไทย
    const thaiDay = date.getDate();
    const thaiTime = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); // แสดงเฉพาะเวลา
  
    return `${thaiYear}-${thaiMonth}-${thaiDay} ${thaiTime}`;
  }
  function inserPort(event)
  {
      event.preventDefault();
      axios.post(`${process.env.REACT_APP_NAME_URL}/sendslip`,{customer_id,portnumber})
      .then(res =>{  
          if(res.data.status == "insert success")  
          { //alert("Insert success")
           handleClose()}
          else{ console.log("Error Portnumber")}
      })
      .catch(err=> {console.log(err)}
      );
  }

;

  const queryParams = new URLSearchParams(window.location.search);
  const value_portnumber = queryParams.get('value');
  
  useEffect(() => {
    payment(customer_id,value_portnumber);

  }, [customer_id]);

  return (

      <div style={{ overflowY: 'auto', maxHeight: '100%' }}>
      <React.Fragment >
        <CssBaseline />
        <Container maxWidth="lg" sx={{ p: 2 }}> 
          <Paper sx={{ p: 2 }}> 
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell component="th">Port</TableCell>
                      <TableCell align="center">DATETIME</TableCell>
                      <TableCell align="right">Amout</TableCell>
                      <TableCell align="right">Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {payment_commission.map((payment_commission, index) => (
                      <TableRow key={payment_commission.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">{payment_commission.port_number}</TableCell>
                        <TableCell align="center">Commission for {convertToThaiBuddhistCalendar(payment_commission.date_commission)}</TableCell>
                        <TableCell align="right">{payment_commission.commission_pay} $ TO {(payment_commission.commission_pay*thbAmounts).toFixed(2)} THB</TableCell>
                        <TableCell align="right">  
                        <span style={{ color: payment_commission.status_commission === 0 ? 'red' : payment_commission.status_commission === 1 ? 'green' : 'black' }}>
                            {payment_commission.status_commission === 0 ? 'ยังไม่ชำระเงิน' : payment_commission.status_commission === 1 ? 'สำเร็จ' : null}
                        </span>
                        </TableCell>
                        <TableCell align="right">
                        {payment_commission.status_commission !== 1 ? (<span onClick={() => handleSubmit(payment_commission.commission_pay, convertToThaiBuddhistCalendar(payment_commission.date_commission),payment_commission.port_number,(payment_commission.commission_pay*thbAmounts).toFixed(2))}>กดเพื่อชำระ</span>) : (
                        <span style={{ color: 'grey', cursor: 'not-allowed' }}>ชำระบิลสำเร็จ</span>)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
          </Paper>
        </Container>
      </React.Fragment>
      </div>


  )
}