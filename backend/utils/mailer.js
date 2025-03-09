import nodemailer from "nodemailer";
import dotenv, { config } from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendWelcomeEmail(email, temporaryPassword) {
  const mailOptions = {
    from: " 'Urban Move'<yourusername@email.com>",
    to: email,
    subject: "Urban Move Admin Registration",
    text: ` Welcome!\n Your temporary password is: ${temporaryPassword}
     Please log in and change your password immediately.`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

export default sendWelcomeEmail;
