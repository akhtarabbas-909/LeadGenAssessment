const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async function (body) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.TO_EMAIL,
      subject: process.env.EMAIL_SUBJECT,
      html: body,
    });

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = { sendEmail };
