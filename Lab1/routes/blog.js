const express = require("express");
const router = express.Router();
const blog = require("./../data/blog");
const users = require("./../data/users");
var objectID = require("mongodb").ObjectId;

router.get("/", async (req, res) => {
  let skip = req.query.skip;
  let take = req.query.take;
  try {
    if (skip) {
      skip = Number(skip);
      // Validate skip
      if (typeof skip != "number") throw "Must enter a number for skip";
      if (skip < 0) throw "Value for skip is invalid";
    }
    if (take) {
      take = Number(take);
      // // Validate take
      if (typeof take != "number") throw "Must enter a number for take";
      if (take < 0) throw "Value for take is invalid";
      if (take > 100) {
        take = 100;
      }
    }
  } catch (e) {
    res.status(400).json({ err: e });
    return;
  }

  try {
    let allPosts = await blog.getAllBlogPosts(skip, take);
    res.status(200).json(allPosts);
  } catch (e) {
    res.status(500).json({ err: e });
  }
});

router.post("/", async (req, res) => {
  let title = req.body.title;
  let body = req.body.body;
  try {
    // Validate title
    if (typeof title != "string") throw "Must provide a string title";
    if (title.trim().length == 0) throw "Title must not be only spaces";

    // Validate body
    if (typeof body != "string") throw "Must provide a string body";
    if (body.trim().length == 0) throw "Body must not be only spaces";
  } catch (e) {
    res.status(400).json({ err: e });
    return;
  }

  try {
    let newPost = await blog.createBlogPost(title, body, req.session.userId);
    res.status(200).json(newPost);
    return;
  } catch (e) {
    res.status(500).json(e);
    return;
  }
});

router.put("/:id", async (req, res) => {
  let id = req.params.id;
  let title = req.body.title;
  let body = req.body.body;
  try {
    if (typeof id != "string") throw "Must provide a string id";
    if (id.trim().length == 0) throw "Id must not be only spaces";
    let newId = objectID(id);
    if (!objectID.isValid(newId)) throw "Id must be valid";

    // Validate title
    if (typeof title != "string") throw "Must provide a string title";
    if (title.trim().length == 0) throw "Title must not be only spaces";

    // Validate body
    if (typeof body != "string") throw "Must provide a string body";
    if (body.trim().length == 0) throw "Body must not be only spaces";
  } catch (e) {
    res.status(400).json({ err: e });
    return;
  }
  try {
    let newPost = await blog.updateBlogPost(
      id,
      title,
      body,
      req.session.userId
    );
    res.status(200).json(newPost);
  } catch (e) {
    res.status(500).json({ err: e });
  }
});

router.patch("/:id", async (req, res) => {
  let id = req.params.id;
  let title = req.body.title;
  let body = req.body.body;
  try {
    if (typeof id != "string") throw "Must provide a string id";
    if (id.trim().length == 0) throw "Id must not be only spaces";
    let newId = objectID(id);
    if (!objectID.isValid(newId)) throw "Id must be valid";
  } catch (e) {
    res.status(400).json({ err: e });
    return;
  }
  try {
    if (title) {
      // Validate title
      if (typeof title != "string") throw "Must provide a string title";
      if (title.trim().length == 0) throw "Title must not be only spaces";

      let updateTitle = await blog.updateTitle(id, title, req.session.userId);
    }
    if (body) {
      // Validate body
      if (typeof body != "string") throw "Must provide a string body";
      if (body.trim().length == 0) throw "Body must not be only spaces";

      let updateBody = await blog.updateBody(id, body, req.session.userId);
    }
  } catch (e) {
    res.status(400).json({ err: e });
    return;
  }
  try {
    let newPost = await blog.getPostbyId(id);
    res.status(200).json(newPost);
  } catch (e) {
    res.status(500).json({ err: e });
  }
});

router.post("/:id/comments", async (req, res) => {
  let id = req.params.id;
  let comment = req.body.comment;
  try {
    if (typeof id != "string") throw "Must provide a string id";
    if (id.trim().length == 0) throw "Id must not be only spaces";
    let newId = objectID(id);
    if (!objectID.isValid(newId)) throw "Id must be valid";

    // Validate title
    if (typeof comment != "string") throw "Must provide a string comment";
    if (comment.trim().length == 0) throw "Comment must not be only spaces";
  } catch (e) {
    res.status(400).json({ err: e });
    return;
  }
  try {
    let newComment = await blog.addComment(id, req.session.userId, comment);
    res.status(200).json(newComment);
  } catch (e) {
    res.status(500).json({ err: e });
  }
});

router.delete("/:blogId/:commentId", async (req, res) => {
  let blogId = req.params.blogId;
  let commentId = req.params.commentId;
  try {
    // Validate blogId
    if (typeof blogId != "string") throw "Must provide a string id";
    if (blogId.trim().length == 0) throw "Id must not be only spaces";
    let newId = objectID(blogId);
    if (!objectID.isValid(newId)) throw "Id must be valid";

    // Validate commentId
    if (typeof commentId != "string") throw "Must provide a string id";
    if (commentId.trim().length == 0) throw "Id must not be only spaces";
    let newId2 = objectID(commentId);
    if (!objectID.isValid(newId2)) throw "Id must be valid";
  } catch (e) {
    res.status(400).json({ err: e });
    return;
  }
  try {
    let deleteComment = await blog.deleteComment(
      blogId,
      commentId,
      req.session.userId
    );
    res.status(200).json(deleteComment);
  } catch (e) {
    res.status(500).json({ err: e });
  }
});

router.post("/signup", async (req, res) => {
  let name = req.body.name;
  let username = req.body.username;
  let password = req.body.password;
  try {
    // Validate name
    if (typeof name != "string") throw "Must provide a string name";
    if (name.trim().length == 0) throw "Name must not be only spaces";

    // Validate username
    if (typeof username != "string") throw "Must provide a string username";
    if (username.trim().length == 0) throw "Username must not be only spaces";

    // Validate password
    if (typeof password != "string") throw "Must provide a string password";
    if (password.trim().length == 0) throw "Password must not be only spaces";
  } catch (e) {
    res.status(400).json({ err: e });
    return;
  }
  try {
    let newUser = await users.createUser(name, username, password);
    res.status(200).json(newUser);
  } catch (e) {
    res.status(500).json({ err: e });
  }
});

router.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  try {
    // Validate username
    if (typeof username != "string") throw "Must provide a string username";
    if (username.trim().length == 0) throw "Username must not be only spaces";

    // Validate password
    if (typeof password != "string") throw "Must provide a string password";
    if (password.trim().length == 0) throw "Password must not be only spaces";
  } catch (e) {
    res.status(400).json({ err: e });
    return;
  }
  try {
    let loggedUser = await users.login(username, password);
    req.session.userId = loggedUser._id;
    res.status(200).json(loggedUser);
    return;
  } catch (e) {
    res.status(500).json({ err: e });
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.status(200).json({ loggedOut: "You have been successfully logged out" });
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    if (typeof id != "string") throw "Must provide a string id";
    if (id.trim().length == 0) throw "Id must not be only spaces";
    let newId = objectID(id);
    if (!objectID.isValid(newId)) throw "Id must be valid";
  } catch (e) {
    res.status(400).json({ err: e });
    return;
  }
  try {
    let foundUser = await blog.getPostbyId(id);
    res.status(200).json(foundUser);
  } catch (e) {
    res.status(500).json({ err: e });
  }
});

module.exports = router;
