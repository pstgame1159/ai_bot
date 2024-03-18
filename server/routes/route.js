const express = require('express');
const router = express.Router();
const controllers = require("../controllers/controller");

router.post('/insertport', controllers.insertPort);
router.post('/login', controllers.login);
router.post('/auth', controllers.auth);
router.post('/updatuser', controllers.updatUser);
router.post('/ports', controllers.getPorts);
router.post('/portsall', controllers.getAllPorts);
router.post('/slipsall', controllers.getAllSlips);
router.post('/historyport', controllers.getPortHistory);
router.post('/payment', controllers.getPayment);
router.post('/paymentall', controllers.getUnpaidPayments);
router.post('/sumcommission', controllers.sumCommission);
router.post("/sendslip", controllers.sendSlip);
router.put("/updatecustomers", controllers.updateCustomers);
router.put("/updateallowport", controllers.updateAllowPort);
router.put("/updatecommission", controllers.updateCommission);
router.post('/upload', controllers.uploadImage);
router.post('/payment_count', controllers.paymentCount);
router.get("/employees", controllers.getEmployees);
router.post('/selectbot', controllers.selectBot);
router.post("/signin", controllers.signIn);
router.put("/update", controllers.updateEmployee);
router.delete("/delete/:id", controllers.deleteEmployee);

module.exports = router;
