export const validateRegistrationStep = (requiredStep) => {
  return (req, res, next) => {
    const registration = req.session.registration || {};

    const stepRequirements = {
      phone: ["username"],
      "verify-phone": ["phoneNumber"],
      email: ["phoneVerified"],
      "verify-email": ["email"],
      "upload-documents": ["emailVerified"],

    };

    const missingRequirements = stepRequirements[requiredStep]?.filter(
      (field) => !registration[field]
    );

    if (missingRequirements?.length) {
      return res.status(403).json({
        success: false,
        requiredStep: Object.keys(stepRequirements).find((step) =>
          stepRequirements[step].some((req) =>
            missingRequirements.includes(req)
          )
        ),
        message: `Missing: ${missingRequirements.join(", ")}`,
      });
    }

    next();
  };
};
