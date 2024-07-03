import crypto from "crypto";
import twilio from "twilio";
import nodemailer from "nodemailer";
import { generateHash } from "./hashservice.js";

export const generateOTP = () => {
  const otp = crypto.randomInt(1000, 9999);
  return otp;
};

export const sendOTPBySMS = async (phone, otp) => {
  const SMS_AUTH_TOKEN = process.env.SMS_AUTH_TOKEN;
  const SMS_SID = process.env.SMS_SID;

  const client = twilio(SMS_SID, SMS_AUTH_TOKEN, {
    lazyLoading: true,
  });

  return await client.messages.create({
    to: phone,
    from: process.env.SMS_FROM_NUMBER,
    body: `Your AuaralLink OTP is :- ${otp}`,
  });
};

export const sendEmail = (receiverEmail, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_EMAIL_PASSWORD,
    },
  });

  transporter.sendMail(
    {
      from: process.env.SENDER_EMAIL,
      to: receiverEmail,
      subject: "AuralLink Authentication One Time Password - OTP",
      text: `Your AuralLink OTP is: ${otp}`,
    },
    (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        console.log("Email sent: " + info.response);
        res.json({ message: "Email sent successfully" });
      }
    }
  );
};

export const verifyOTP = (hashedOTP, data) => {
  const computedHash = generateHash(data);

  return computedHash === hashedOTP;
};
