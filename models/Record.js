const { Schema, model } = require("mongoose");

const RecordSchema = new Schema({
  time: {
    type: Number, //number of seconds
    required: true,
  },
  wins: {
    type: Number,
  },
  losses: {
    type: Number,
  },
  draws: {
    type: Number,
  },
});

const Record = model("record", RecordSchema);

module.exports = Record;
