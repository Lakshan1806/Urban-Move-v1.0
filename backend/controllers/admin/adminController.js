import adminAuthController from "./adminAuthController.js";
import adminAccountManagementController from "./adminAccountManagementController.js";
import customerAccountManagementController from "./customerAccountManagementController.js";
import carManagementController from "./carManagementController.js";
import driverAccountManagementController from "./driverAccountManagementController.js";
import promoManagementController from "./promoManagementController.js";

const adminController = {
  auth: adminAuthController,
  admin: adminAccountManagementController,
  customer: customerAccountManagementController,
  driver: driverAccountManagementController,
  car: carManagementController,
  promotion: promoManagementController,
};

export default adminController;
