const validateOtp = async (type, identifier, otp, otpModel) => {
    const query = {};
    query[type] = identifier;
    query.otp = otp;
  
    const otpRecord = await otpModel.findOne(query);
    if (!otpRecord || otpRecord.expiresAt < Date.now()) {
      return false; // OTP is invalid or expired
    }
  
    // Delete OTP record after validation
    await otpModel.deleteOne({ _id: otpRecord._id });
    return true;
  };
  export default validateOtp;
  