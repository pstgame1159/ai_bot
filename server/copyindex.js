var jwt = require('jsonwebtoken');
const key_jwt = "robot301"
const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/uploadslip'); // กำหนดโฟลเดอร์ที่ต้องการให้ Multer ใช้เก็บไฟล์
  },
  filename: function (req, file, cb) {
    const filename =`${Date.now()}-${file.originalname}`
    cb(null, filename);
  }
});

const storageport = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/uploadport'); // กำหนดโฟลเดอร์ที่ต้องการให้ Multer ใช้เก็บไฟล์
  },
  filename: function (req, file, cb) {
    const filename =`${Date.now()}-${file.originalname}`
    cb(null, filename);
  }
});

const upload = multer({ storage: storage })
const uploadport = multer({ storage: storageport })

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "robot_trade",
});

app.post('/insertport', uploadport.single('image'), (req, res) => {
  const customer_id = req.body.customer_id;
  const portnumber = req.body.portnumber;
  const filename = req.file.filename; // Get the path of the uploaded file

  const sql = "INSERT INTO ports (customer_id, port_number,img_port) VALUES (?,?,?)"; // Include image_path in your SQL query
  db.query(sql, [customer_id, portnumber,filename], (err, result) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json({
        status: "insert success"
      });
    }
  });
});




app.post('/login',(req,res)=>{
  const sql = "SELECT * FROM customers WHERE username = ? AND password = ? ";
  db.query(sql,[req.body.username,req.body.password],(err,data)=>{
    if(err) return res.json("ERROR");
    if(data.length>0)
    {
      var token = jwt.sign({ username: data[0] }, key_jwt, { expiresIn: '1h' });
      return res.json({
        status:"Success",
        token:token,
        customers:data[0]
      }
        );
    }
    else{
      return res.json("Not Found User");
    }

  })

})




app.post('/auth',(req,res)=>{
 const token = req.headers.authorization.split(" ")[1]

 try{


  const decoded_user = jwt.verify(token, key_jwt);
  return res.json({
   status:"Login success",
   decord_jwt:decoded_user}
   );
 }catch(err){
  
  return res.json({
    status:"error",
    error:err.message} );

}})

app.post('/updatuser',(req,res)=>{
  const sql = "SELECT * FROM customers WHERE customer_id = ? ";
  db.query(sql,req.body.customer_id ,(err,data)=>{
    if(err) return res.json("ERROR");
    if(data.length>0)
    {
      return res.json({
      status:"updateuser",
      customer:data[0]}
      );
    }else{return res.json("Not Found User");}
  })
})

app.post('/ports',(req,res)=>{
  const sql = "SELECT * FROM ports WHERE customer_id = ? ";
  db.query(sql,req.body.customer_id,(err,data)=>{
    if(err) return res.json("ERROR");
      return res.json({
        status:"success",
        data:data}
        );
      })

})

app.post('/portsall',(req,res)=>{
  const sql = "SELECT * FROM ports WHERE 1 AND status_port != 0  ";

  db.query(sql,(err,data)=>{
    if(err) return res.json("ERROR");
      return res.json({
        status:"success",
        data:data}
        );
  })
})
app.post('/slipsall',(req,res)=>{
  const sql = "SELECT * FROM payment_info WHERE 1  ";
  db.query(sql,(err,data)=>{
    if(err) return res.json("ERROR");
      return res.json({
        status:"success",
        data:data}
        );

  })

})



app.post('/historyport',(req,res)=>{


  const sql = "SELECT profits.* FROM profits  INNER JOIN ports ON profits.port_number = ports.port_number WHERE ports.customer_id = ? AND  profits.port_number = ?";

  db.query(sql,[req.body.customer_id,req.body.port_number],(err,data)=>{
    if(err) return res.json("ERROR");

      return res.json({
        status:"success",
        data:data}
        );
  })
})
app.post('/payment',(req,res)=>{

    const sql = "SELECT pay_commission.* FROM ports INNER JOIN pay_commission ON pay_commission.port_number = ports.port_number WHERE ports.customer_id = ? AND  pay_commission.port_number = ?;    ";
    
    db.query(sql,[req.body.customer_id,req.body.port_number],(err,data)=>{
      if(err) return res.json("ERROR");
        return res.json({
          status:"success",
          data:data}
          );
    })
  })

app.post('/paymentall', (req, res) => {
  const sql = "SELECT pay_commission.* FROM pay_commission INNER JOIN ports ON pay_commission.port_number = ports.port_number WHERE ports.customer_id = ? AND status_commission = 0;";
  db.query(sql, [req.body.customer_id], (err, data) => {
    if (err) {
      return res.json("ERROR");
    } else {
      return res.json({
        status: "success",
        data: data
      });
    }
  });
});

app.post('/sumcommission',(req,res)=>{
    const sql = "SELECT sum(commission_pay) as sum_commission FROM `pay_commission` WHERE port_number = ? AND status_commission = 0;";
    db.query(sql,req.body.port_number,(err,data)=>{
      if(err) return res.json("ERROR");
        return res.json({
          status:"success",
          data:data}
          );
    })
})
app.post("/sendslip",(req, res) => {
    const sql = "INSERT INTO payment_info (customer_id, referenceNo, fromAccountName, bankname, amount,name_img) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [req.body.customer_id, req.body.referenceNo, req.body.fromAccountName, req.body.bankname, req.body.amount, req.body.filename], (err, result) => {
      if(err) return res.json(err);
      else {
        return res.json({ status: "Success"});
      }
    });
});
app.put("/updatecustomers", (req, res) => {
  const customer_id = req.body.customer_id;
  const newAmountToAdd = req.body.amount; 
  const getAmountSql = "SELECT amout FROM customers WHERE customer_id = ?";
  db.query(getAmountSql, [customer_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ status: "Error", message: "Error fetching customer data" });
    } else {
      if (result.length > 0) {
        const currentAmount = result[0].amout; 
        const updatedAmount = currentAmount + newAmountToAdd; 
        const sql = "UPDATE customers SET amout = ? WHERE customer_id = ?";
        db.query(sql,[updatedAmount, customer_id],(err, result) => {
            if (err) {
              console.log(err);
            } else {
              return res.json({ status: "Success",amout:req.body.amount});
            }
          }
        );
      }
    }
  });
});

app.put("/updateallowport", (req, res) => {
  const portNumber = req.body.portNumber ;
  const sql = "UPDATE ports SET status_port = 0 WHERE port_number  = ?";
  db.query(sql,[portNumber],(err, result) => {
      if (err) {
        console.log(err);
      } else {
        return res.json({  status: "Success"});
      }
    }
  );
});
  
app.put("/updatecommission", async (req, res) => {
  try {
    const selectedPorts = req.body.selectedPorts;
    const sql = "UPDATE pay_commission SET status_commission = 1 WHERE port_number IN (?)";
    const sql2 = "UPDATE profits SET status = 1 WHERE port_number IN (?)";
    const sql3 = "UPDATE ports SET status_port = 0 WHERE port_number IN (?)";
    const sql4 = "UPDATE customers SET amout = ? WHERE customer_id = ?";
    
    db.query(sql, [selectedPorts], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Failed to update commissions.");
      } else {
      db.query(sql2, [selectedPorts], (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("Failed to update profits.");
          } else {

            db.query(sql3, [selectedPorts], (err, result) => {
              if (err) {
                console.error(err);
                res.status(500).send("Failed to update profits.");
              } else 
              {
                    db.query(sql4, [req.body.amoutuser,req.body.customer_id], (err, result) => {
                        if (err) {
                          console.error(err);
                          res.status(500).send("Failed to update profits.");
                        } else {
                          return res.json({  status: req.body.amoutuser});
                        }
                      });
              }
            });
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An unexpected error occurred.");
  }
});

app.post('/upload',upload.single('image'),(req,res)=>{
      const filename = req.file.filename; 
      res.json({ message: "Hello OK", filename: filename });
  
});

app.post('/payment_count',(req,res)=>{
    const sql = "SELECT COUNT(DISTINCT pay_commission.port_number) AS total_rounds, SUM(commission_pay) AS total_commission_pay FROM ports INNER JOIN pay_commission ON pay_commission.port_number =ports.port_number WHERE ports.customer_id = ? AND pay_commission.status_commission = 0;";
    db.query(sql,[req.body.customer_id],(err,data)=>{
      if(err) return res.json("ERROR");
        return res.json({
          status:"success",
          data:data}
          );
    })
  })
app.get("/employees", (req, res) => {
    db.query("SELECT * FROM customers", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

app.post('/selectbot',(req,res)=>{
  const sql = "SELECT * FROM bot_templates WHERE 1 ";
  db.query(sql,(err,data)=>{
    if(err) return res.json("ERROR");
      return res.json({
        status:"success",
        data:data}
        );

  })

})

app.post("/signin", (req, res) => {
  const fullname = req.body.fullname;
  const username = req.body.username;
  const password = req.body.password;

    db.query("INSERT INTO customers (fullname, username, password) VALUES (?,?,?)",
      [fullname, username, password],
      (err, result) => {
        if (err) {
          res.status(401).send("Error Insert");
        } else {
          res.send("Values Inserted");
        }
      }
    );

});


















app.put("/update", (req, res) => {
  const id = req.body.id;
  const wage = req.body.wage;
  db.query(
    "UPDATE employees SET wage = ? WHERE id = ?",
    [wage, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM employees WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(3002, () => {
    console.log("Yey, your server is running on port 3002");
});
