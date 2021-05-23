const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/Config.env" });

const SendAlert = async (Arry,date) => {
    let message = (
        '<table style="border: 1px solid #333;">' +
        '<thead>' +
        '<th> Date </th>' +
        '<th> Name </th>'  +
        '<th> Address </th>'  +
        '<th> Pincode </th>'  +
        '<th> Fees </th>'  +
        '<th> Dose1 </th>'  +
        /*...*/
        '</thead>'
      ); 
      
      for(const { Name , Address ,Pincode ,Fees , Dose1 , Date } of Arry) {
         message += (
           '<tr>' +
            '<td>' + Date + '</td>' +
            '<td>' + Name + '</td>' +
            '<td>' + Address + '</td>' +
            '<td>' + Pincode + '</td>' +
            '<td>' + Fees + '</td>' +
            '<td>' + Dose1 + '</td>' +
            /*...*/
          '</tr>'
         );
      }
      
      message +=  '</table>';

 let transporter = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USERNAME, // generated ethereal user
          pass: process.env.SMTP_PASSWORD, // generated ethereal password
        },
      });
  
      let info = await transporter.sendMail({
        from: `"RajeTech API Admin" <${process.env.SMTP_USERNAME}>`, // sender address
        to: "cloud@byraje.com", // list of receivers
        cc: process.env.SMTP_USERNAME,
        subject: `Vacination Details Date ${date}`, // Subject line
        html: message, // html body
      });

    }
module.exports = { SendAlert }    