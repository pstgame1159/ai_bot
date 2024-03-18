const jwt = require('jsonwebtoken');
const key_jwt = "robot301";
const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../front_end/public/uploadslip');
  },
  filename: function (req, file, cb) {
    const filename =`${Date.now()}-${file.originalname}`
    cb(null, filename);
  }
});

const storageport = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../front_end/public/uploadport');
  },
  filename: function (req, file, cb) {
    const filename =`${Date.now()}-${file.originalname}`
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });
const uploadport = multer({ storage: storageport });

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "db",
  password: "MYSQL_ROOT_PASSWORD",
  database: "robot_trade",
});

const insertPort = (req, res) => {
  uploadport.single('image')(req, res, () => {
    const customer_id = req.body.customer_id;
    const portnumber = req.body.portnumber;
    const filename = req.file.filename;

    const sql = "INSERT INTO ports (customer_id, port_number,img_port) VALUES (?,?,?)";
    db.query(sql, [customer_id, portnumber, filename], (err, result) => {
      if (err) {
        return res.json(err);
      } else {
        return res.json({
          status: "insert success"
        });
      }
    });
  });
};

const login = (req, res) => {
  const sql = "SELECT * FROM customers WHERE username = ? AND password = ?";
  db.query(sql, [req.body.username, req.body.password], (err, data) => {
    if (err) return res.json("ERROR");
    if (data.length > 0) {
      const token = jwt.sign({ username: data[0] }, key_jwt, { expiresIn: '1h' });
      return res.json({
        status: "Success",
        token: token,
        customers: data[0]
      });
    } else {
      return res.json("Not Found User");
    }
  });
};

const auth = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded_user = jwt.verify(token, key_jwt);
    return res.json({
      status: "Login success",
      decord_jwt: decoded_user
    });
  } catch (err) {
    return res.json({
      status: "error",
      error: err.message
    });
  }
};

const updatUser = (req, res) => {
  const sql = "SELECT * FROM customers WHERE customer_id = ?";
  db.query(sql, req.body.customer_id, (err, data) => {
    if (err) return res.json("ERROR");
    if (data.length > 0) {
      return res.json({
        status: "updateuser",
        customer: data[0]
      });
    } else {
      return res.json("Not Found User");
    }
  });
};

const getPorts = (req, res) => {
  const sql = "SELECT * FROM ports WHERE customer_id = ?";
  db.query(sql, req.body.customer_id, (err, data) => {
    if (err) return res.json("ERROR");
    return res.json({
      status: "success",
      data: data
    });
  });
};

const getAllPorts = (req, res) => {
  const sql = "SELECT * FROM ports WHERE 1 AND status_port != 0";
  db.query(sql, (err, data) => {
    if (err) return res.json("ERROR");
    return res.json({
      status: "success",
      data: data
    });
  });
};

const getAllSlips = (req, res) => {
  const sql = "SELECT * FROM payment_info WHERE 1";
  db.query(sql, (err, data) => {
    if (err) return res.json("ERROR");
    return res.json({
      status: "success",
      data: data
    });
  });
};

const getPortHistory = (req, res) => {
  const sql = "SELECT profits.* FROM profits INNER JOIN ports ON profits.port_number = ports.port_number WHERE ports.customer_id = ? AND profits.port_number = ?";
  db.query(sql, [req.body.customer_id, req.body.port_number], (err, data) => {
    if (err) return res.json("ERROR");
    return res.json({
      status: "success",
      data: data
    });
  });
};

const getPayment = (req, res) => {
  const sql = "SELECT pay_commission.* FROM ports INNER JOIN pay_commission ON pay_commission.port_number = ports.port_number WHERE ports.customer_id = ? AND pay_commission.port_number = ?";
  db.query(sql, [req.body.customer_id, req.body.port_number], (err, data) => {
    if (err) return res.json("ERROR");
    return res.json({
      status: "success",
      data: data
    });
  });
};

const getUnpaidPayments = (req, res) => {
  const sql = "SELECT pay_commission.* FROM pay_commission INNER JOIN ports ON pay_commission.port_number = ports.port_number WHERE ports.customer_id = ? AND status_commission = 0";
  db.query(sql, [req.body.customer_id], (err, data) => {
    if (err) return res.json("ERROR");
    return res.json({
      status: "success",
      data: data
    });
  });
};

const sumCommission = (req, res) => {
  const sql = "SELECT SUM(commission_pay) as sum_commission FROM `pay_commission` WHERE port_number = ? AND status_commission = 0";
  db.query(sql, req.body.port_number, (err, data) => {
    if (err) return res.json("ERROR");
    return res.json({
      status: "success",
      data: data
    });
  });
};

const sendSlip = (req, res) => {
  const sql = "INSERT INTO payment_info (customer_id, referenceNo, fromAccountName, bankname, amount, name_img) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [req.body.customer_id, req.body.referenceNo, req.body.fromAccountName, req.body.bankname, req.body.amount, req.body.filename], (err, result) => {
    if (err) return res.json(err);
    else {
      return res.json({ status: "Success" });
    }
  });
};

const updateCustomers = (req, res) => {
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
        db.query(sql, [updatedAmount, customer_id], (err, result) => {
          if (err) {
            console.log(err);
          } else {
            return res.json({ status: "Success", amout: req.body.amount });
          }
        });
      }
    }
  });
};

const updateAllowPort = (req, res) => {
  const portNumber = req.body.portNumber;
  const sql = "UPDATE ports SET status_port = 0 WHERE port_number = ?";
  db.query(sql, [portNumber], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      return res.json({ status: "Success" });
    }
  });
};

const updateCommission = async (req, res) => {
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
              } else {
                db.query(sql4, [req.body.amoutuser, req.body.customer_id], (err, result) => {
                  if (err) {
                    console.error(err);
                    res.status(500).send("Failed to update profits.");
                  } else {
                    return res.json({ status: req.body.amoutuser });
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
};

const uploadImage = (req, res) => {
  upload.single('image')(req, res, () => {
    const filename = req.file.filename;
    res.json({ message: "Hello OK", filename: filename });
  });
};

const paymentCount = (req, res) => {
  const sql = "SELECT COUNT(DISTINCT pay_commission.port_number) AS total_rounds, SUM(commission_pay) AS total_commission_pay FROM ports INNER JOIN pay_commission ON pay_commission.port_number =ports.port_number WHERE ports.customer_id = ? AND pay_commission.status_commission = 0";
  db.query(sql, [req.body.customer_id], (err, data) => {
    if (err) return res.json("ERROR");
    return res.json({
      status: "success",
      data: data
    });
  });
};

const getEmployees = (req, res) => {
  db.query("SELECT * FROM customers", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
};

const selectBot = (req, res) => {
  const sql = "SELECT * FROM bot_templates WHERE 1";
  db.query(sql, (err, data) => {
    if (err) return res.json("ERROR");
    return res.json({
      status: "success",
      data: data
    });
  });
};

const signIn = (req, res) => {
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
};

const updateEmployee = (req, res) => {
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
};

const deleteEmployee = (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM employees WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
};

module.exports = {
  insertPort: insertPort,
  login: login,
  auth: auth,
  updatUser: updatUser,
  getPorts: getPorts,
  getAllPorts: getAllPorts,
  getAllSlips: getAllSlips,
  getPortHistory: getPortHistory,
  getPayment: getPayment,
  getUnpaidPayments: getUnpaidPayments,
  sumCommission: sumCommission,
  sendSlip: sendSlip,
  updateCustomers: updateCustomers,
  updateAllowPort: updateAllowPort,
  updateCommission: updateCommission,
  uploadImage: uploadImage,
  paymentCount: paymentCount,
  getEmployees: getEmployees,
  selectBot: selectBot,
  signIn: signIn,
  updateEmployee: updateEmployee,
  deleteEmployee: deleteEmployee
};