import mongoose from "mongoose";
import CarModel from "./carInstance.model.js";

const recentlyDeletedCar = mongoose.model(
  "RecentlyDeletedCarUnit",
  CarModel.schema
);
 
export default recentlyDeletedCar;
  