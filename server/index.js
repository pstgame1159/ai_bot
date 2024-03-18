const express = require("express");
const cors = require("cors");
const route = require("./routes/route"); // เปลี่ยนชื่อตัวแปรเป็น route

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());
app.use('/', route); // เปลี่ยนเป็น route

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
