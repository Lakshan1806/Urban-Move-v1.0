import getController from "./getController.js";
import createController from "./createController.js";
import deleteController from "./deleteController.js";
import updateController from "./updateController.js";

const carManagementController = {
  get: getController,
  create: createController,
  delete: deleteController,
  update: updateController,
};

export default carManagementController;
