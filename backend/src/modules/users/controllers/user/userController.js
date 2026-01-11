import userAuthController from "../../../auth/routes/controllers/userAuthController.js"
import userPasswordController from "./userPasswordController.js";
import userProfileController from "./userProfileController.js";

const userController = {
    auth: userAuthController,
    profile: userProfileController,
    password: userPasswordController,
  };
  
  export default userController;