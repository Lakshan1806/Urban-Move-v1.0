import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import PDFDocument from "pdfkit";
import fs from "fs";

dotenv.config();
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.EMAIL_PASS,
  },
});

const generatePDF = (subject, message, filename) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filename);

    const orange = '#ff7c1d';
    const softGray = '#f5f5f5';
    const black = '#000000';

    doc.pipe(stream);

    const logoPath = "backend/uploads/pdflogo/pdflogo2.png"; 
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 30, { width: 100 });
    }

    // Header
    doc
      .fontSize(26)
      .fillColor(orange)
      .font('Helvetica-Bold')
      .text("URBAN MOVE", { align: "center" });

    doc
      .moveDown(0.3)
      .fontSize(16)
      .fillColor(black)
      .text("Payment Receipt", { align: "center" });

    doc.moveDown(2);

    doc
      .fontSize(14)
      .fillColor(black)
      .font("Helvetica-Bold")
      .text(`Subject: ${subject}`);
    doc.moveDown(0.5);

    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor(black)
      .text(`${message}`);
    doc.moveDown(1.5);

    const boxTop = doc.y;
    const boxLeft = 50;
    const boxWidth = 500;
    const boxHeight = 110;

    doc
      .save()
      .roundedRect(boxLeft, boxTop, boxWidth, boxHeight, 10)
      .fillColor(softGray)
      .fill()
      .restore();

    doc
      .fillColor(black)
      .font("Helvetica")
      .fontSize(12)
      .text(`Receipt No: RM-${Date.now()}`, boxLeft + 15, boxTop + 15)
      .text(`Date: ${new Date().toLocaleString()}`, boxLeft + 15, boxTop + 35)
      .text(`Status: Paid`, boxLeft + 15, boxTop + 55)
      .text(`Payment Method: Card`, boxLeft + 15, boxTop + 75);

    doc.moveDown(7);

    // Divider
    doc
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .strokeColor(orange)
      .lineWidth(1)
      .stroke();
    doc.moveDown();

    // Footer
    doc
      .fontSize(12)
      .fillColor(black)
      .font("Helvetica-Bold")
      .text("Thank you for choosing Urban Move!", { align: "center" });

    doc
      .font("Helvetica")
      .fillColor(black)
      .text("For support, contact: support@urbanmove.lk", { align: "center" });

    doc.end();

    stream.on("finish", () => resolve(filename));
    stream.on("error", (err) => reject(err));
  });
};



router.post("/send-email", async (req, res) => {
  const { recipient, subject, message } = req.body;
  const pdfFilename = `email_${Date.now()}.pdf`;

  try {
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

    await transporter.sendMail(mailOptions);

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
