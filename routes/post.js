const express = require("express");
const Post = require("./../schemas/post");
const { isAuthorized, isAuthenticated } = require("../middlewares");
const router = express.Router();
// const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY,
//     api_secret: process.env.API_SECRET,
// });

// CREATE NEW POST
router.post("/", async (req, res) => {
  try {
    const { name, title, description } = req.body;
    const savePost = new Post({ name, title, description });
    const result = await savePost.save();
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

//all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put(
  "/:id",
  isAuthenticated,
  (req, res, next) => isAuthorized(req, res, next, "ADMIN"),
  async (req, res) => {
    if (req.user.id != req.post.id) {
      res.status(401).json("You can only Update your post");
    } else {
      try {
        // const post = await Post.findById(req.params.id);
        // if (error) return res.status(400).send(error.details[0].message);
        const post = await post.findByIdAndUpdate(req.params.id, {
          $set: {
            title: req.body.title,
            name: req.body.name,
            description: req.body.description,
          },
        });

        if (!post) {
          res
            .status(400)
            .send("The Post with the given id could not be found!");
        } else {
          res.send("The post has been updated successfully");
        }
      } catch (error) {
        res.status(500).json(error);
      }
    }
  }
);

// router.delete("/:id", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (post.userId === req.body.userId) {
//       await Post.deleteOne();
//       res.status(200).json("the post is deleted");
//     } else {
//       res.status(403).json("you can only delete your post");
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

router.delete(
  "/:id",
  isAuthenticated,
  (req, res, next) => isAuthorized(req, res, next, "ADMIN"),
  async (req, res) => {
    //Deleting the desired object from the JSON array and returing the deleted data as a response
    if (req.user.id != req.post.id) {
      res.status(401).json("You can only delete your post");
    } else {
      try {
        const post = await Post.findByIdAndRemove(String(req.params.id));
        if (!post)
          res
            .status(400)
            .send("The post with the given id could not be found!");
        res.send(post);
      } catch (err) {
        res.status(500).json(err); //this handles the error if there is one from the server
      }
    }

    // router.delete("./:id", isAuthenticated , (req , res , next) => isAuthorized(req, res, next, "ADMIN"), async (req, res) => {
    // //Deleting the desired object from the JSON array and returing the deleted data as a response
    //     if (req.user.id===req.post.id)
    //     try{
    //     const post = await Post.findByIdAndRemove(String(req.params.id));
    //     if (!post)
    //       res.status(400).send("The post with the given id could not be found!");
    //     res.send(post);
    //   }catch(err){
    //     res.status(500).json(err) //this handles the error if there is one from the server
    // }
    // catch(err){
    //     res.status(404).json("User not found")
    //   }
    // })
  }
);
module.exports = router;
