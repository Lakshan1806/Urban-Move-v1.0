import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import PDFDocument from "pdfkit";
import fs from "fs";

dotenv.config();
const router = express.Router();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.EMAIL_PASS,
  },
});

// Function to generate PDF file
const generatePDF = (subject, message, filename) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filename);

    doc.pipe(stream);
    doc.fontSize(18).text("URBAN MOVE", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Subject: ${subject}`);
    doc.moveDown();
    doc.fontSize(12).text(`Message:\n${message}`);
    doc.end();

    stream.on("finish", () => resolve(filename));
    stream.on("error", (err) => reject(err));
  });
};

router.post("/send-email", async (req, res) => {
  const { recipient, subject, message } = req.body;
  const pdfFilename = `email_${Date.now()}.pdf`;

  try {
    // Generate the PDF file
    await generatePDF(subject, message, pdfFilename);

    const mailOptions = {
      from: process.env.EMAIL,
      to: recipient,
      subject: subject,
      text: "Thank you for choosing Urban Move.",
      attachments: [
        {
          filename: pdfFilename,
          path: pdfFilename,
          contentType: "application/pdf",
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Delete the PDF file immediately after sending the email
    try {
      fs.unlinkSync(pdfFilename);
      console.log(`Deleted PDF file: ${pdfFilename}`);
    } catch (unlinkErr) {
      console.error("Failed to delete PDF file:", unlinkErr);
    }

    res.status(200).json({ success: true, message: "Email with PDF sent successfully!" });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ success: false, message: "Email sending failed", error });
  }
});

export { router as emailRoutes };
