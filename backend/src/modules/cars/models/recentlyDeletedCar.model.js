import mongoose from "mongoose";
import CarModel from "./carModel.model.js";

const recentlyDeletedCar = mongoose.model(
  "RecentlyDeletedCarModel",
  CarModel.schema
);
 
export default recentlyDeletedCar;
  