/*
Éste archivo se encarga de crear un transporte de nodemailer para poder enviar correos electrónicos.
*/

import nodemailer from "nodemailer";
export default nodemailer.createTransport({
  service: "gmail",
  port: 587,

  auth: {
    user: "torresrennerguillermo@gmail.com",
    pass: process.env.APPLICATION_KEY,
  },
});
