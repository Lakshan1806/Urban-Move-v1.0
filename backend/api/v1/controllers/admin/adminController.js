import adminAuthController from "./adminAccount/adminAuthController.js";
import adminAccountManagementController from "./adminAccount/adminAccountManagementController.js";
import customerAccountManagementController from "./customerAccount/customerAccountManagementController.js";
import carManagementController from "./car/carManagementController.js";
import driverAccountManagementController from "./driverAccount/driverAccountManagementController.js";
import promoManagementController from "./promotion/promoManagementController.js";

const adminController = {
  auth: adminAuthController,
  admin: adminAccountManagementController,
  customer: customerAccountManagementController,
  driver: driverAccountManagementController,
  car: carManagementController,
  promotion: promoManagementController,
};
 
export default adminController;
