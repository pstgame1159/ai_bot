import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';

import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),



];

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

export const EurUsd = () => {

  const [bot_templates, setBot_templates] = useState([])
  
  useEffect(() => {

    const selectbot = async () => {
      try {

          const res = await axios.post(`${process.env.REACT_APP_NAME_URL}/selectbot`);

          if (res.data.status === "success") {
            setBot_templates(res.data.data)
          }
      } catch (err) {
          console.log(err);
      }
    };

    selectbot()

  
  }, []);










  return (
    <>

    <div className='Container' style={{ height: '100vh', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '80%' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 400 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align='center'>ID_BOT</StyledTableCell>
                <StyledTableCell align='center'>TIME FRAME</StyledTableCell>
                <StyledTableCell align='center'>Strategy</StyledTableCell>
                <StyledTableCell align='center'>Model</StyledTableCell>
                <StyledTableCell align='center'>Name Bot</StyledTableCell>
                <StyledTableCell align='center'>MSE_percent	 </StyledTableCell>
                <StyledTableCell align='center'>MAE_percent </StyledTableCell>
                <StyledTableCell align='center'>BACK TEST </StyledTableCell>
                <StyledTableCell align='center'>Action </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bot_templates.map((row) => (
                <StyledTableRow key={row.bot_id}>
                  <StyledTableCell component="th" scope="row" align='center'>
                    {row.bot_id}
                  </StyledTableCell>
                  <StyledTableCell align='center'>Daily</StyledTableCell>
                  <StyledTableCell align='center'>{row.strategy}</StyledTableCell>
                  <StyledTableCell align='center'>{row.model}</StyledTableCell>
                  <StyledTableCell align='center'>{row.name_bot}</StyledTableCell>
                  <StyledTableCell align='center'>{row.MSE_percent}</StyledTableCell>
                  <StyledTableCell align='center'>{row.MAE_percent}</StyledTableCell>
                  <StyledTableCell align='center'><a href="backtest/StrategyTester.htm" target="_blank" rel="noopener noreferrer"> SHOW </a></StyledTableCell>
                  <StyledTableCell align='center'>
                    <Button variant="contained" color="success">
                      <DownloadIcon />
                    </Button>
                  </StyledTableCell>
                
                
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
    </>
  
);
};