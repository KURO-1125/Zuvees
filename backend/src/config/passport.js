const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
const ApprovedEmail = require('../models/approvedEmail.model');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try{
                console.log('Callback URL:', process.env.GOOGLE_CALLBACK_URL);
                const email = profile.emails[0].value;
                const approvedEmail = await ApprovedEmail.findOne({ email });

                if (!approvedEmail) {
                    return done(null, false, { message: 'Email not approved' });
                }

                let user = await User.findOne({ googleId: profile.id });
                if (!user) {
                    user = new User({
                        googleId: profile.id,
                        email: email,
                        name: profile.displayName,
                        role: approvedEmail.role,
                    });
                    await user.save();
                }
                return done(null, user);
            }
            catch (error) {
                return done(error, null);
            }
        }
    )
);