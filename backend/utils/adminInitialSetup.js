import generateRandomPassword from "./passwordGenerator.js";
import sendWelcomeMail from "./mailer.js";
import Admin from "../models/admin.model.js";

async function checkAndCreateAdmin() {
  try {
    const existingAdmin = await Admin.findOne({});

    if (existingAdmin) {
      console.log("An admin account already exists. No new admin created.");
    } else {
      const email = process.env.DEFAULT_ADMIN_EMAIL;
      const temporaryPassword = generateRandomPassword();

      const newAdmin = new Admin({
        name: "Default Admin",
        username: "admin",
        email: email,
        password: temporaryPassword,
        age: 0,
        firstLogin: true,
      });

      await newAdmin.save();
      console.log(
        `Admin account created for ${email} with temporary password ${temporaryPassword}`
      );

      await sendWelcomeMail(email, temporaryPassword);
      console.log(`Welcome email sent to ${email}`);
    }
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}

export default checkAndCreateAdmin;
