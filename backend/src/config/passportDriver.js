import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import driverModel from "../models/driver.models.js";
import logger from "../utils/logger.js";

passport.use(
  "google-driver",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/driver/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        const terminatedDriver = await driverModel.findOne({
          email,
          isTerminated: true,
        });
        if (terminatedDriver) {
          return done(null, false, { message: "Account terminated" });
        }

        const existingGoogleDriver = await driverModel.findOne({
          googleId: profile.id,
        });
        if (existingGoogleDriver) {
          return done(null, existingGoogleDriver);
        }

        const existingLocalDriver = await driverModel.findOne({
          email,
          authMethod: "local",
        });

        if (existingLocalDriver) {
          existingLocalDriver.googleId = profile.id;
          existingLocalDriver.authMethod = "google";
          existingLocalDriver.password = undefined;
          existingLocalDriver.isAccountVerified = true;
          existingLocalDriver.avatar = profile.photos[0]?.value;
          await existingLocalDriver.save({ validateBeforeSave: false });
          logger.info(`Converted local driver to Google auth: ${email}`);
          return done(null, existingLocalDriver);
        }

        let baseUsername = profile.displayName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        let proposedUsername = baseUsername;
        let counter = 0;
        while (await driverModel.findOne({ username: proposedUsername })) {
          counter++;
          proposedUsername = `${baseUsername}${counter}`;
        }

        const newDriver = await driverModel.create({
          googleId: profile.id,
          username: proposedUsername,
          email,
          avatar: profile.photos[0]?.value,
          authMethod: "google",
          isAccountVerified: false,
          phone: `google-${profile.id}`,
        });

        logger.info(`New Google driver created (pending phone verification): ${email}`);
        return done(null, newDriver);
      } catch (error) {
        logger.error(`Google strategy (driver) error: ${error.message}`);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const driver = await driverModel.findById(id);
    done(null, driver);
  } catch (err) {
    done(err, null);
  }
});
