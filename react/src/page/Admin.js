
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
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';

export const Admin = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [portsuser, setPortsuser] = useState([]);
  const [fileName, setFileName] = useState("");
  const [modal, setModal] = useState(false);

  const toggleModal = (fileName) => {
    setFileName(fileName);
    setModal(!modal);
  };
  if(modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const fetchData = async () => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_NAME_URL}/portsall`);
        if (res.data.status === "success") {
            setPortsuser(res.data.data)
        }
    } catch (err) {
        console.log(err);
    }
  };
    const allowport = async (portNumber) => {
      try {
          const res = await axios.put(`${process.env.REACT_APP_NAME_URL}/updateallowport`,{portNumber});
          if (res.data.status === "Success") {
            fetchData();
          }
      } catch (err) {
          console.log(err);
      }
  };
  useEffect(() => {

    fetchData();
}, []);






  return (
    <>
      <div style={{ overflowY: 'auto', maxHeight: '100%' }}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ p: 2 }}>
          <Paper sx={{ p: 2 }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="center">port_number</TableCell>
                    <TableCell align="center">balance</TableCell>
                    <TableCell align="center">equity</TableCell>
                    <TableCell align="center">status_port</TableCell>
                    <TableCell align="center">IMG</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? portsuser.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : portsuser
                  ).map((row) => (
                    <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                       <TableCell component="th" scope="row">{row.customer_id}</TableCell>
                      <TableCell component="th" scope="row">{row.port_number}</TableCell>
                      <TableCell align="center">{row.balance}</TableCell>
                      <TableCell align="right">{row.equity}</TableCell>
                      <TableCell align="right">  
                      <span style={{ color: row.status_port === 1 ? 'red' : (row.status_port === 2 ? 'orange' : 'black') }}>
                      {row.status_port === 1 ? 'OFFLINE' : (row.status_port === 2 ? 'Waiting for permission' : row.status_port)}
                      </span>
                    </TableCell>
                      <TableCell align="center">
                        <ButtonGroup variant="outlined" aria-label="Basic button group">
                        <Button variant="contained" onClick={() => toggleModal(row.img_port)} className="btn-modal" >
                            <ImageIcon />
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                      <TableCell align="center">
                        <ButtonGroup variant="outlined" aria-label="Basic button group">
                        <Button onClick={() => allowport(row.port_number)}>ALLOW</Button>
                          <Button>decline</Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={portsuser.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Container>
      </div>
      {modal && (
      <div className="modal">
        <div onClick={toggleModal} className="overlay"></div>
        <div className="manage-modal-content">
            <div className="manage-box-decoration">
              <div>
              <img src={`http://localhost:3000/uploadport/${fileName}`} alt="upload image" className="img-display-before-manage" />
              </div>
            </div>
          {/* <button className="close-modal" onClick={toggleModal}>CLOSE</button> */}
        </div>
      </div>
    )}
    </>
  );
};