const express = require("express");
const User = require("./userDb");
const Post = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, async (req, res) => {
  try {
    const user = await User.insert(req.body);
    res.status(201).json({
      user
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: "Internal server error"
    });
  }
});

router.post("/:id/posts", [validateUserId, validatePost], async (req, res) => {
  const { user } = req;

  try {
    const post = await Post.insert({ text: req.body.text, user_id: user.id });

    res.status(201).json({
      post
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: "Internal server error"
    });
  }
});

router.get("/", async (_req, res) => {
  try {
    const users = await User.get();

    res.status(200).json({
      users
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: "Internal server error"
    });
  }
});

router.get("/:id", validateUserId, (req, res) => {
  const { user } = req;

  res.status(200).json({
    user
  });
});

router.get("/:id/posts", validateUserId, async (req, res) => {
  const { user } = req;

  try {
    const posts = await User.getUserPosts(user.id);
    res.status(200).json({
      posts
    });
  } catch (error) {
    res.status(500).json({
      message: "some message"
    });
  }
});

router.delete("/:id", validateUserId, async (req, res) => {
  try {
    await User.remove(req.user.id);

    res.status(200).json({
      message: "Successfully deleted user",
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: "Internal server error"
    });
  }
});

router.put("/:id", (req, res) => {});

//custom middleware

async function validateUserId(req, res, next) {
  const { id } = req.params;

  try {
    const user = await User.getById(id);

    if (!user) {
      res.status(400).json({ message: "invalid user id" });
      return;
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
}

function validateUser(req, res, next) {
  if (req.body === undefined || Object.keys(req.body).length === 0) {
    res.status(400).json({
      message: "missing user data"
    });
    return;
  }

  if (req.body.name === undefined) {
    res.status(400).json({
      message: "missing required name field"
    });
    return;
  }

  next();
}

function validatePost(req, res, next) {
  if (req.body === undefined || Object.keys(req.body).length === 0) {
    res.status(400).json({
      message: "missing post data"
    });
    return;
  }

  if (req.body.text === undefined) {
    res.status(400).json({
      message: "missing required text field"
    });
    return;
  }

  next();
}

module.exports = router;
