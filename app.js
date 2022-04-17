require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Posts = require("./routes/post");
const app = express();
const passport = require("passport");
const session = require("express-session");
const userRouter = require("./routes/user");

require("./config/passport")(passport);
require("./config/google-passport")(passport);

const PORT = process.env.PORT;

mongoose.connect(process.env.CONNECTION_STRING, {}, () =>
    console.log("Connected to DB")
);

// middleware to parse body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({ secret: "secret" }));

app.use(passport.initialize());
app.use(passport.session());

app.use("/post", Posts);
app.use("/users", userRouter);

app.get("/", (req, res) => {
    res.send("Helllo");
});

app.listen(PORT || 3000, () => console.log("Server is up and running"));
