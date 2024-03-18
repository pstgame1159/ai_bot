import React, { useState, useEffect } from 'react';
import './css/Payment.css'
import slip from '../asset/slip.png'
import { useAuth } from '../components/AuthContext';
import axios from 'axios'
import Modal from '../components/Modal';
export const Payment = () => {
  const {customer_id,payment_count,payment_count_all,username,Amout } = useAuth();

  const [totalCommissionPay, setTotalCommissionPay] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);

  const pay_all = () => {
    const thbAmounts = totalCommissionPay * exchangeRate;
    if (Amout - thbAmounts.toFixed(2) > 0) {
      alert("ยอดคงเหลือ  : " + (Amout - thbAmounts.toFixed(2)));
    } else {
      alert(Amout - thbAmounts.toFixed(2));
    }
  };

  

  useEffect(() => {
    payment_count(customer_id);
  
    const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
  
    axios.get(apiUrl)
      .then(response => {
        const exchangeRate = response.data.rates.THB;
        setExchangeRate(exchangeRate);
      })
      .catch(error => {
        console.error('Error fetching exchange rate:', error);
      });
  }, [customer_id]);

  useEffect(() => {
    if (payment_count_all && payment_count_all.length > 0) {
      setTotalCommissionPay(payment_count_all[0].total_commission_pay);
    }
  }, [payment_count_all]);

  return (
    <div class='main'>
      <div className='pay-container'>
        <h1>Payment</h1>
        <img src={slip} class="qr-pic" />
        <div className="info">
          <h2>Username : {username} </h2>
          {totalCommissionPay != null && exchangeRate != null && (
            <h2>ยอดค้างชำระ: {totalCommissionPay} $ = {(totalCommissionPay * exchangeRate).toFixed(2)} ฿</h2>
          )}
          {payment_count_all && payment_count_all.length > 0 && (
            <h2>จำนวน PORT ที่ค้างชำระ: {payment_count_all[0]?.total_rounds}</h2>
          )}
          <h2>ยอดคงเหลือในระบบ : {Amout} </h2>
        </div>
        <Modal/>
        <button className="image-upload-button" onClick={pay_all}>
          ชำระยอดทั้งหมด
        </button>
      </div>
    </div>
  );
};
