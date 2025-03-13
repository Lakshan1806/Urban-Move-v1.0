 import sendEmail from "./nodemailer.js";
 import phoneMessage from "./twilioClient.js";
 const sendOtp = async (req, res) => {
    const { type, phone, email } = req.body;
  
    try {
      const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
      const expiryTime = Date.now() + 15 * 60 * 1000;
  
      if (type === "phone" && phone) {
        await otpModel.create({ phone, otp: generatedOtp, expiresAt: expiryTime });
        await phoneMessage(phone, `Your OTP for Cab Booking System is: ${generatedOtp}`);
      } else if (type === "email" && email) {
        await sendEmail(email, "Email Verification OTP", `Your OTP is: ${generatedOtp}`);
      } else {
        return res.status(400).json({ message: "Invalid type or missing details" });
      }
  
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error sending OTP", error: error.message });
    }
  };
  export default sendOtp;