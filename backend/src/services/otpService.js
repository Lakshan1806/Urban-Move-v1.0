import otpModel from "../models/otpModels.js";
import sendSMS from "../utils/sendSms.js";
import nodemailer from "../utils/nodemailer.js";

const EXPIRY_MINUTES = 5;

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));
export default {
  sendOtp: async (type, identifier) => {
    try {
      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

      await otpModel.deleteMany({ [type]: identifier });

      await otpModel.create({
        [type]: identifier,
        otp,
        expiresAt,
      });

      if (type === "phone") {
        await sendSMS(identifier, `Your verification code is: ${otp}`);
        console.log(`OTP sent to phone ${identifier}: ${otp}`);
      } else {
        await nodemailer.sendEmail(
          identifier,
          "Your Verification Code",
          `Your verification code is: ${otp} (valid for ${EXPIRY_MINUTES} minutes)`
        );
        console.log(`OTP sent to email ${identifier}: ${otp}`);
      }

      return { success: true, otp };
    } catch (error) {
      console.error(`Error sending ${type} OTP:`, error);
      throw error;
    }
  },

  validateOtp: async (type, identifier, otp) => {
    try {
      const otpRecord = await otpModel.findOneAndDelete({
        [type]: identifier,
        otp,
        expiresAt: { $gt: new Date() },
      });

      return {
        isValid: !!otpRecord,
        message: otpRecord ? "Valid OTP" : "Invalid or expired OTP",
      };
    } catch (error) {
      console.error("Error validating OTP:", error);
      throw error;
    }
  },

  resendOtp: async function (type, identifier) {
    try {
      return await this.sendOtp(type, identifier);
    } catch (error) {
      console.error("Error resending OTP:", error);
      throw error;
    }
  },
};
