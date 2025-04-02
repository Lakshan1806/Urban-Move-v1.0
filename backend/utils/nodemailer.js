import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({
  path: "C:/Users/USER/Videos/Software-Development-Project/.env",
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(email, subject, text) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending welcome email:", error.message);
    throw error;
  }
}

export default sendEmail;
