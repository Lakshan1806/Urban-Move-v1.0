const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config(); 

const router = express.Router();


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASS 
    }
});


router.post("/send-email", async (req, res) => {
    const { recipient, subject, message } = req.body;

    const mailOptions = {
        from: process.env.EMAIL,
        to: recipient,
        subject: subject,
        text: message
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Email sending failed", error });
    }
});

module.exports = router;
