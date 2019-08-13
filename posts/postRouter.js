const express = require("express");
const Post = require("./postDb");
const validatePost = require("../users/userRouter").validatePost;

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const posts = await Post.get();

    res.status(200).json({
      posts
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: "internal server error"
    });
  }
});

router.get("/:id", validatePostId, (req, res) => {
  res.json({ post: req.post });
});

router.delete("/:id", validatePostId, async (req, res) => {
  const { post } = req;

  try {
    await Post.remove(post.id);

    res.json({
      post,
      message: "Successfully deleted post"
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: "Internal Server Error"
    });
  }
});

router.put("/:id", [validatePostId, validatePost], async (req, res) => {
  const { post } = req;

  try {
    await Post.update(post.id, req.body);

    res.json({
      post: {
        ...post,
        ...req.body
      }
    });
  } catch (error) {}
});

// custom middleware

async function validatePostId(req, res, next) {
  const { id } = req.params;
  try {
    const post = await Post.getById(id);

    if (post === undefined) {
      res.status(400).json({
        message: "invalid post id"
      });
      return;
    }

    req.post = post;
    next();
  } catch (error) {
    res.status(500);
  }
}

module.exports = router;
