const cron = require("node-cron");
const fs = require("fs");
const dotenv = require("dotenv");
const axios = require("axios");
//const nodemailer = require("nodemailer");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone");
const { SendAlert } = require("./SendMail");
const ConnectDB = require("./config/DB");

ConnectDB();

const CowinDB = require("./Modules/CowinDBCenters");

dotenv.config({ path: "./config/config.env" });

const CallCowin = () => {
  var Today = moment().tz("Asia/Kolkata").format("DD-MM-YYYY");
  //APICall(Today);
  for (i = 0; i <= 2; i++) {
    var DinamicDate = moment()
      .add(+i, "days")
      .tz("Asia/Kolkata")
      .format("DD-MM-YYYY");
    APICall(DinamicDate);
  }

  console.log("Calling Every 10 Sec");
};

setInterval(CallCowin, 10000);

const APICall = async (date) => {
  //console.log(date);
  const response = await axios({
    method: "GET",
    url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=395&date=${date}`,
    headers: {
      "Accept-Language": "IN",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
    },
  });

  const ResponseData = response.data.sessions;

  var result = ResponseData.filter(function (data) {
    return data.min_age_limit == 18 && data.available_capacity_dose1 > 0;
  });

  var CenterArray = [];
  for (i = 0; i < result.length; i++) {
    if (result) {
      const Center = {
        Name: result[i].name,
        Address: result[i].address,
        Pincode: result[i].pincode,
        Fees: result[i].fee,
        Dose1: result[i].available_capacity_dose1,
        Date: date,
      };
      CenterArray.push(Center);
      //console.log(Center)
    } else {
      //console.log(" Dose for 18+ Not Avialiable  Now");
    }
  }
  //console.log(CenterArray);
  console.log(`Total Avilabale Centers Date ${date} => ` + result.length);

  if (result.length > 0) {
    const PushDetails = {
      Date: date,
      Centers: result.length,
    };

    const CowinDateCenter = await CowinDB.findOne({
      Date: date,
    });

    if (CowinDateCenter && CowinDateCenter.Centers < result.length) {
      //Update DB //Send SMS and Emails

      const UpdateCowinDB = await CowinDB.findOneAndUpdate(
        { Date: date },
        {
          $set: {
            Date: date,
            Centers: result.length,
          },
        },
        { new: true }
      ).select("-__v");

      SendAlert(CenterArray, date);
      var CenterArray = [];

      const SMSresponse = await axios({
        method: "POST",
        url: "https://www.fast2sms.com/dev/bulkV2",
        headers: {
          "Content-Type": "application/json",
          authorization:
            "CS5gsTjlIjVLJ2Pmm5R8QniIoaiKwB5QbHSLnehqDtORVGxpb4IjsKJTe6Em",
        },
        data: {
          route : "v3",
          sender_id : "TXTIND",
          message: `Slots are avilabale Date ${date},Please check your mail for more information`,
          language: "english",
          flash: 0,
          numbers: "9987242234",
        },
      });

      console.log(SMSresponse.data.message);
      console.log("Updated and Send");
    } else if (CowinDateCenter && CowinDateCenter.Centers == result.length) {
      // DO Nothing
      console.log("Doing Nothing");
    }

    if (!CowinDateCenter) {
      //Add New entry in DB // Send Emial SMS
      const NewCoinDateEntry = await CowinDB.create(PushDetails);
      SendAlert(CenterArray, date);
      var CenterArray = [];

      const SMSresponse = await axios({
        method: "POST",
        url: "https://www.fast2sms.com/dev/bulkV2",
        headers: {
          "Content-Type": "application/json",
          authorization:
            "CS5gsTjlIjVLJ2Pmm5R8QniIoaiKwB5QbHSLnehqDtORVGxpb4IjsKJTe6Em",
        },
        data: {
          route : "v3",
          sender_id : "TXTIND",
          message: `Slots are avilabale Date ${date},Please check your mail for more information`,
          language: "english",
          flash: 0,
          numbers: "9987242234",
        },
      });
      console.log("Created and Send");
      console.log(SMSresponse.data.message);
    }
  }
};
