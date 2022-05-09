const { Schema, model } = require("mongoose");

const RecordSchema = new Schema({
  time: {
    type: Number, //number of seconds
    required: true,
  },
});

const Record = model("record", RecordSchema);

module.exports = Record;
