const express = require("express");
const User = require("./userDb");

const router = express.Router();

router.post("/", (req, res) => {});

router.post("/:id/posts", (req, res) => {});

router.get("/", async (req, res) => {
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

router.get("/:id", (req, res) => {});

router.get("/:id/posts", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

//custom middleware

async function validateUserId(req, res, next) {
  const { id } = req.params;

  try {
    const user = User.getById(id);
  } catch (error) {}
}

function validateUser(req, res, next) {}

function validatePost(req, res, next) {}

module.exports = router;
