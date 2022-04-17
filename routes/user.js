const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const Joi = require("joi");
const User = require("../schemas/user");
const passport = require("passport");
const { isAuthenticated } = require("../middlewares");

//Google authentication
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { successRedirect: "/users/login-success" })
);

router.get("/login-success", (req, res) => {
    res.json({ message: "Authenticated" });
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/users/login-success",
    })(req, res, next);
});

router.post("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

router.get("/profile", isAuthenticated, (req, res) => {
    res.render("profile");
});

router.post("/signup", async (req, res) => {
    const body = req.body;
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    const { error } = schema.validate(body);

    if (error) {
        res.send(error);
    } else {
        const newUser = new User({
            name: body.name,
            email: body.email,
            password: body.password,
            role: "USER",
        });

        bcrypt.hash(newUser.password, 10, async (err, hash) => {
            newUser.password = hash;
            const result = await newUser
                .save()
                .catch((e) => res.status(500).send(e.message));
            res.status(201).json(result);
        });
    }
});
// router.post('/',async (req,res)=>{
//     //Validating the request body data before updating
//     const {error} = validateUser(req.body);
//     if(error) return res.status(400).send(error.details[0].message);

//     let user = await User.findOne({email: req.body.email});
//     if(user) return res.status(400).send('User already registered.');

//     user = new User(_.pick(req.body,['name','email','password']));
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt);

//     await user.save();
//     const token = user.generateAuthToken();
//     res.header('x-auth-token',token).send(_.pick(user,['_id','name','email']));
// });

// router.get('/me', auth, async(req,res)=>{
//     const user = await User.findById(req.user._id).select('-password');
//     res.send(user);
// });
// ............................................................................................
// router.get('/me', auth, async(req,res)=>{
//   const user = await User.findById(req.user._id).select('-password');
//   res.send(user);
// });
module.exports = router;
