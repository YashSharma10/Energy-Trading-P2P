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

        // Only allow Google login for accounts that already exist (registered via email)
        const user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (!user) {
          // No account found — reject with a known error code so the
          // callback controller can redirect with a friendly message.
          logger.warn(`Google OAuth: no account found for ${email} — registration required`);
          const err = new Error("NOT_REGISTERED");
          err.code = "NOT_REGISTERED";
          return done(err, null);
        }

        // Link Google to their existing email/password account (first time only)
        if (!user.googleId) {
          user.googleId = profile.id;
          user.authProvider = "google";
          user.isVerified = true;
          if (!user.avatar && profile.photos?.[0]?.value) {
            user.avatar = profile.photos[0].value;
          }
          await user.save();
          logger.info(`Google account linked to existing user: ${email}`);
        }

        return done(null, user);
      } catch (error) {
        logger.error("Google OAuth strategy error:", error);
        return done(error, null);
      }
    }
  )
);

export default passport;

