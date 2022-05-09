const { Router } = require("express");
const Record = require("../models/Record");

const router = Router();

router.post("/a", async (req, res) => {
  var { id } = req.body;
  //console.log(id);
  try {
    const record = await Record.findById(id);
    if (!record) {
      throw new Error("No record");
    }
    //console.log(record.time);
    res.status(200).json(record.time);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { time, id } = req.body;

  if (id == null) {
    const newRecord = new Record({ time });
    try {
      const recorda = await newRecord.save();
      // console.log(recorda);
      if (!recorda) {
        throw new Error("Error with saving");
      }
      res.status(200).json(recorda.id);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    const record = await Record.findById(id);
    record.time += time;
    // const newRecord = new Record({ time });
    try {
      const recorda = await record.save();
      // console.log(recorda);
      if (!recorda) {
        throw new Error("Error with saving");
      }
      res.status(200).json(record.id);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
});

module.exports = router;
