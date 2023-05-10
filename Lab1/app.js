const express = require("express");
const app = express();
const session = require("express-session");
const configRoutes = require("./routes");

app.use(express.json());

app.use(
  session({
    name: "LoginCookie",
    secret: "Cookie used for login",
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 6000000 },
  })
);

app.use("/blog", (req, res, next) => {
  if (req.originalUrl == "/blog/login" || req.originalUrl == "/blog/signup") {
    next();
    return;
  }
  if (req.method == "POST") {
    if (req.session.userId) {
      next();
      return;
    } else {
      res.status(401).json({ err: "You must login to access this!" });
    }
  } else {
    next();
    return;
  }
});

app.use("/blog/:id", (req, res, next) => {
  if (req.method == "PUT" || req.method == "PATCH") {
    if (req.session.userId) {
      next();
      return;
    } else {
      res.status(401).json({ err: "You must login to access this!" });
    }
  } else {
    next();
    return;
  }
});

app.use("/blog/:id/comments", (req, res, next) => {
  if (req.method == "POST") {
    if (req.session.userId) {
      next();
      return;
    } else {
      res.status(401).json({ err: "You must login to access this!" });
    }
  } else {
    next();
    return;
  }
});

app.use("/blog/:blogId/:commentId", (req, res, next) => {
  if (req.method == "DELETE") {
    if (req.session.userId) {
      next();
      return;
    } else {
      res.status(401).json({ err: "You must login to access this!" });
    }
  } else {
    next();
    return;
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("Your routes will be running on http://localhost:3000");
});
