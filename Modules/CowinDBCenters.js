const mongoose = require("mongoose");
const moment = require("moment-timezone");

const CowinSchema = new mongoose.Schema({
  Date: {
    type: String,
  },
  Centers: {
    type: Number,
  },
  CreatedAt: {
    type: String,
    default: function () {
      return moment().tz("Asia/Kolkata").format("MMMM Do YYYY, hh:mm:ss A");
    },
  },
  ModifiedAt: {
    type: String,
    default: function () {
      return moment().tz("Asia/Kolkata").format("MMMM Do YYYY, hh:mm:ss A");
    },
  },
});

module.exports = mongoose.model("COWinDB", CowinSchema);
