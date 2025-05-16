// services/userService.js
import userModel from "../models/usermodel.js";
import bcrypt from "bcrypt";
import { handleErrors } from "../utils/errorHandler.js";

export default {
  userExists: async (field, value) => {
    try {
      const query = { [field]: value };
      return await userModel.exists(query);
    } catch (error) {
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const user = new userModel(userData);
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  },

  validatePassword: async (user, password) => {
    try {
      if (!user.password) return false;
      return await bcrypt.compare(password, user.password);
    } catch (error) {
      throw error;
    }
  },

  findById: async (id) => {
    try {
      return await userModel.findById(id);
    } catch (error) {
      throw error;
    }
  },

  findByUsername: async (username) => {
    try {
      return await userModel.findOne({ username });
    } catch (error) {
      throw error;
    }
  },
};
