const LocalStrategy = require("passport-local").Strategy;
const User = require("../schemas/user");
const bcrypt = require("bcrypt");

module.exports = function (passport) {
    // 1. Implement Strategy
    passport.use(
        new LocalStrategy(
            { usernameField: "email" },
            async (email, password, done) => {
                const user = await User.findOne({ email: email });
                if (!user) {
                    done(null, false);
                } else {
                    bcrypt.compare(
                        password,
                        user.password,
                        (err, isMatched) => {
                            if (isMatched) {
                                done(null, user);
                            } else {
                                done(null, false);
                            }
                        }
                    );
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
