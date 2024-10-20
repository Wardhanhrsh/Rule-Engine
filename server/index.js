const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const userRoute = require("./routes/rules")

const app = express();
require("dotenv").config();

app.use(express.json()); 
// app.use(bodyParser.json())
app.use(cors());


// app.get("/", (req, res) =>{
//     res.send("Welcome to rule engine APIs..")
// })

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.listen(port, (req, res) => {
  console.log(`Server running on port: ${port}`);
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection eastablished"))
  .catch((error) => console.log("MongoDB connection failed: ", error.message));


const ruleRoutes = require("./routes/rules");
app.use("/api/rules", ruleRoutes);

