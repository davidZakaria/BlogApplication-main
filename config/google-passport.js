const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../schemas/user");

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:3000/users/auth/google/callback",
            },
            async function (accessToken, refreshToken, profile, cb) {
                console.log("Google Profile: ", profile);
                const user = await User.findOne({ googleId: profile.id });
                if (user) {
                    cb(null, user);
                } else {
                    const newUser = new User({
                        name: profile._json.name,
                        email: profile._json.email,
                        role: "USER",
                        googleId: profile.id,
                    });
                    const result = await newUser.save();
                    cb(null, result);
                }
            }
        )
    );

    // 2. Serialize User
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    // 3. Deserialize User
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
    });
};
