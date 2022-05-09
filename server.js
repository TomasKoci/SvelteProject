const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { mongoURI, port } = require("./config");
const recordRoutes = require("./routes/record");

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("tiny"));

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/api/record", recordRoutes);
app.get("/", (req, res) => res.send("This is the server"));
app.listen(port, () => console.log("express is at port:" + port));
