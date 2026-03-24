import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";
import config from "./index.js";
import logger from "../utils/logger.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email found in Google profile"), null);
        }

        // Check if user already exists (by googleId or email)
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (user) {
          // Link Google account if signed up via email before
          if (!user.googleId) {
            user.googleId = profile.id;
            user.authProvider = "google";
            user.isVerified = true;
            if (!user.avatar && profile.photos?.[0]?.value) {
              user.avatar = profile.photos[0].value;
            }
            await user.save();
          }
          return done(null, user);
        }

        // Create new user via Google
        const newUser = new User({
          googleId: profile.id,
          email,
          name: profile.displayName || "",
          avatar: profile.photos?.[0]?.value || "",
          authProvider: "google",
          isVerified: true,
          // Default role — frontend will ask user to pick role on first login
          role: "CONSUMER",
        });

        await newUser.save();
        logger.info(`New Google OAuth user created: ${email}`);
        return done(null, newUser);
      } catch (error) {
        logger.error("Google OAuth strategy error:", error);
        return done(error, null);
      }
    }
  )
);

export default passport;
