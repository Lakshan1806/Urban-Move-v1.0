import userPasswordController from "./userPasswordController.js";
import userProfileController from "./userProfileController.js";

const userController = {
    
    profile: userProfileController,
    password: userPasswordController,
  };
  
  export default userController;