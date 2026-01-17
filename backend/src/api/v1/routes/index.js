import { Router } from "express";

import authRouter, {
  mountPath as authPath,
} from "#modules/auth/routes/authRoutes.js";
import adminRoutes from "#modules/admin/routes/adminRoutes.js";
//import userRoutes from "#modules/users/routes/userRoute.js";
import rideRoutes from "#modules/rides/routes/rideRoutes.js";
import scheduleRoutes from "#modules/schedules/routes/scheduleRoutes.js";
import carRoutes from "#modules/cars/routes/carRoutes.js";
import locationRoutes from "#modules/location/routes/locationRoute.js";
import driverFetchRoutes from "#modules/drivers/routes/DriverfetchRoute.js";
import driverRideRoutes from "#modules/drivers/routes/driverRideRoutes.js";
import feedbackRoutes from "#modules/feedback/routes/feedbackRoutes.js";
import liveTrackingRoutes from "#modules/tracking/routes/liveTrackingRoutes.js";
import driverAcceptanceRoutes from "#modules/drivers/routes/driverAcceptanceRoutes.js";
import fetchRoute from "#modules/drivers/routes/fetchRoute.js";
import tripHistoryRoutes from "#modules/rides/routes/tripHistoryRoutes.js";
import { emailRoutes } from "#modules/messaging/routes/email.js";
import messageRoutes from "#modules/messaging/routes/messageRoutes.js";
import callLogRoutes from "#modules/messaging/routes/callLogRoutes.js";

export const v1RouteBindings = [
  [authPath, authRouter],
  //["/user", userRoutes],
  ["/admin", adminRoutes],
  ["/cars", carRoutes],
  ["/rideRoute", rideRoutes],
  ["/schedule", scheduleRoutes],
  ["/location", locationRoutes],
  ["/driver", driverFetchRoutes],
  ["/driver-rides", driverRideRoutes],
  ["/driverrides", driverRideRoutes],
  ["/live-tracking", liveTrackingRoutes],
  ["/driver-acceptance", driverAcceptanceRoutes],
  ["/driver-acceptance", fetchRoute],
  ["/triphistory", tripHistoryRoutes],
  ["/email", emailRoutes],
  ["/messages", messageRoutes],
  ["/call-log", callLogRoutes],
  ["/feedbacks", feedbackRoutes],
];

const createV1Router = () => {
  const router = Router();

  v1RouteBindings.forEach(([path, subRouter]) => {
    router.use(path, subRouter);
  });

  return router;
};

export default createV1Router;
