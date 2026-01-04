import adminRoutes from "./adminRoutes.js";
import userRoutes from "./userRoute.js";
import rideRoutes from "./rideRoutes.js";
import scheduleRoutes from "./scheduleRoutes.js";
import carRoutes from "./carRoutes.js";
import locationRoutes from "./locationRoute.js";
import driverFetchRoutes from "./DriverfetchRoute.js";
import driverRideRoutes from "./driverRideRoutes.js";
import feedbackRoutes from "./feedbackRoutes.js";
import liveTrackingRoutes from "./liveTrackingRoutes.js";
import driverAcceptanceRoutes from "./driverAcceptanceRoutes.js";
import fetchRoute from "./fetchRoute.js";
import tripHistoryRoutes from "./tripHistoryRoutes.js";
import { emailRoutes } from "./email.js";
import messageRoutes from "./messageRoutes.js";
import callLogRoutes from "./callLogRoutes.js";

const registerRoutes = (app) => {
  const routeBindings = [
    ["/auth", userRoutes],
    ["/user", userRoutes],
    ["/api/auth", userRoutes],
    ["/admin", adminRoutes],
    ["/api/admin", adminRoutes],
    ["/api/cars", carRoutes],
    ["/api/rideRoute", rideRoutes],
    ["/api/schedule", scheduleRoutes],
    ["/api/location", locationRoutes],
    ["/api/driver", driverFetchRoutes],
    ["/api/driver-rides", driverRideRoutes],
    ["/api/driverrides", driverRideRoutes],
    ["/api/live-tracking", liveTrackingRoutes],
    ["/api/driver-acceptance", driverAcceptanceRoutes],
    ["/api/driver-acceptance", fetchRoute],
    ["/api/triphistory", tripHistoryRoutes],
    ["/api/email", emailRoutes],
    ["/api/messages", messageRoutes],
    ["/api/call-log", callLogRoutes],
    ["/api/feedbacks", feedbackRoutes],
  ];

  routeBindings.forEach(([path, router]) => {
    app.use(path, router);
  });
};

export default registerRoutes;
