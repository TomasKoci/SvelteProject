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
    res
      .status(200)
      .json({
        time: record.time,
        wins: record.wins,
        losses: record.losses,
        draws: record.draws,
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { time, id, haswon } = req.body;
  console.log(haswon);
  let newRecord;
  if (id == null) {
    if (haswon == 1) {
      newRecord = new Record({ time: time, wins: 1, losses: 0, draws: 0 });
    }
    if (haswon == -1) {
      newRecord = new Record({ time: time, wins: 0, losses: 1, draws: 0 });
    }
    if (haswon == 0) {
      newRecord = new Record({ time: time, wins: 0, losses: 0, draws: 1 });
    }

    try {
      const recorda = await newRecord.save();
      console.log(recorda);
      if (!recorda) {
        throw new Error("Error with saving");
      }
      res
        .status(200)
        .json(recorda.id, recorda.wins, recorda.losses, recorda.draws);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    const record = await Record.findById(id);
    record.time += time;

    if (haswon == 1) {
      record.wins += 1;
    }
    if (haswon == -1) {
      record.losses += 1;
    }
    if (haswon == 0) {
      record.draws += 1;
    }
    try {
      const recorda = await record.save();
      console.log("pepe");
      // console.log(recorda);
      if (!recorda) {
        throw new Error("Error with saving");
      }
      res.status(201).json({
        id: record.id,
        wins: record.wins,
        losses: record.losses,
        draws: record.draws,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
});

module.exports = router;
