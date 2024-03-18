import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
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
import Button from '@mui/material/Button'; // เพิ่ม import สำหรับปุ่ม








export const Historyport = () => {

  const urlParams = new URLSearchParams(window.location.search);
  const port_number = urlParams.get('value');
  const { historyport, historyPortuser, customer_id } = useAuth();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  useEffect(() => {
    historyport(customer_id, port_number);


  }, [customer_id]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

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
                      <TableCell align="right">balance</TableCell>
                      <TableCell align="right">equity</TableCell>
                      <TableCell align="right">status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {(rowsPerPage > 0
                ? historyPortuser.slice((page - 1) * rowsPerPage, page * rowsPerPage)
                : historyPortuser
              ).map((row) => (
                      <TableRow key={row.profit_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">{row.port_number}</TableCell>
                        <TableCell align="center">{new Date(row.date_transaction).toLocaleDateString()}</TableCell>
                        <TableCell align="right">{row.balance}</TableCell>
                        <TableCell align="right"> {row.equity} </TableCell>
                        <TableCell align="right">
                        {row.status}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
          </Paper>
        </Container>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <Button
            variant="contained"
            color="primary"
            disabled={page === 1}
            onClick={(event) => handleChangePage(event, page - 1)}
          >
            Previous Page
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={rowsPerPage * page >= historyPortuser.length}
            onClick={(event) => handleChangePage(event, page + 1)}
            style={{ marginLeft: '1rem' }}
          >
            Next Page
          </Button>
        </div>
      </React.Fragment>
      
      </div>


  )
}