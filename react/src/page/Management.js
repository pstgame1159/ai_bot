
import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ButtonGroup from '@mui/material/ButtonGroup';
import ImageIcon from '@mui/icons-material/Image';
import axios from 'axios';
import moment from 'moment';




export const Management = () => {
  const [modal, setModal] = useState(false);
  const [portsuser, setPortsuser] = useState([]);
  const [fileName, setFileName] = useState("");
  const toggleModal = (fileName) => {
    setFileName(fileName);
    setModal(!modal);
  };
  if(modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }
  useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_NAME_URL}/slipsall`);
            if (res.data.status === "success") {
                setPortsuser(res.data.data)
            }
        } catch (err) {
            console.log(err);
        }
    };

    fetchData();
}, []);

const formatThaiTimeAbbreviated = (dateTime) => {
  const utcDateTime = moment.utc(dateTime);
  const thaiDateTime = utcDateTime.clone().utcOffset('+07:00');
  
  const thaiMonth = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const formattedDate = `${thaiDateTime.date()} ${thaiMonth[thaiDateTime.month()]} ${thaiDateTime.year() + 543}`;
  const formattedTime = `${thaiDateTime.format('HH:mm')} น.`;
  
  return `${formattedDate} เวลา ${formattedTime}`;
};

  return (
    <>
    <div style={{ overflowY: 'auto', maxHeight: '100%' }}>
    <React.Fragment >
      <CssBaseline />
      <Container maxWidth="lg" sx={{ p: 2 }}> 
        <Paper sx={{ p: 2 }}> 
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                  <TableCell>customer_id</TableCell>
                    <TableCell align="center">referenceNo</TableCell>
                    <TableCell align="right">fromAccountName </TableCell>
                    <TableCell align="right">bankname</TableCell>
                    <TableCell align="right">transactionDateTime</TableCell>
                    <TableCell align="center">amount</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {portsuser.map((row) => (
                    <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">{row.customer_id}</TableCell>
                    <TableCell align="center">{row.referenceNo }</TableCell>
                    <TableCell align="right">{row.fromAccountName}</TableCell>
                    <TableCell align="right">{row.bankname}</TableCell>
                    <TableCell align="right">{formatThaiTimeAbbreviated(row.transactionDateTime)}</TableCell>
                    <TableCell align="center">
                      {row.amount}
                      </TableCell>
                      <TableCell align="center">  
                        <ButtonGroup variant="outlined" aria-label="Basic button group">
                        <Button variant="contained" onClick={() => toggleModal(row.name_img)} className="btn-modal" >

                            <ImageIcon />
                        </Button>
                        </ButtonGroup>
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
    {modal && (
      <div className="modal">
        <div onClick={toggleModal} className="overlay"></div>
        <div className="manage-modal-content">
            <div className="manage-box-decoration">
              <div>
              <img src={`http://localhost:3000/uploadslip/${fileName}`} alt="upload image" className="img-display-before-manage" />
              </div>
            </div>
          {/* <button className="close-modal" onClick={toggleModal}>CLOSE</button> */}
        </div>
      </div>
    )}
    </>
    
  );
}