require("dotenv-safe").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const PGSession = require("connect-pg-simple");
const { passport } = require("./config/passport-config");
const { router } = require("./router/router");
const { db } = require("./db/db");
const fileupload = require("express-fileupload");



const app = express();

// NODE-102 start
app.use(fileupload());
app.use(express.urlencoded({ extended: false })); 
// NODE-102 end

app.use(express.json());
app.use(
  session({
    store: new (PGSession(session))({
      pool: db.pool,
      createTableIfMissing: true,
    }),
    secret: "pawsup-secret",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", router);
app.use(express.static(path.join(__dirname, "./build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./build"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, (err) => {
  if (err) {
    console.log(`Something went wrong while starting server on PORT: ${PORT}`);
    console.log(err);
    return;
  }

  console.log(`Server is listening on PORT: ${PORT}`);
});
