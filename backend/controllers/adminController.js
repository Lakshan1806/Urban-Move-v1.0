import authController from "./authController.js";
import adminAccountManagementController from "./adminAccountManagementController.js";
import carManagementController from "./carManagementController.js";

const adminController = {
  auth: authController,
  account: adminAccountManagementController,
  car: carManagementController,
};

export default adminController;