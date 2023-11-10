const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Article = require("../models/Article");
const Comment = require("../models/Comment");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Articles

router.get("", async (req, res) => {
  try {
    const locals = {
      title: "Sports Blog - Home Page",
    };
    const articles = await Article.find().sort({ createdAt: "desc" });
    res.render("index", { locals, articles });
  } catch (error) {
    console.log(error);
  }
});

router.get("/football", async (req, res) => {
  try {
    const locals = {
      title: "Sports Blog - Football Page",
    };
    const footballArticles = await Article.find({
      sportType: "Football",
    }).sort({ createdAt: "desc" });
    res.render("football", { locals, articles: footballArticles });
  } catch (error) {
    console.log(error);
  }
});

router.get("/tennis", async (req, res) => {
  try {
    const locals = {
      title: "Sports Blog - Tennis Page",
    };
    const tennisArticles = await Article.find({
      sportType: "Tennis",
    }).sort({ createdAt: "desc" });
    res.render("tennis", { locals, articles: tennisArticles });
  } catch (error) {
    console.log(error);
  }
});

router.get("/fitness", async (req, res) => {
  try {
    const locals = {
      title: "Sports Blog - Fitness Page",
    };
    const fitnessArticles = await Article.find({
      sportType: "Fitness",
    }).sort({ createdAt: "desc" });
    res.render("fitness", { locals, articles: fitnessArticles });
  } catch (error) {
    console.log(error);
  }
});

router.get("/compose", async (req, res) => {
  try {
    const locals = {
      title: "Sports Blog - Compose Page",
    };
    res.render("compose", { locals });
  } catch (error) {
    console.log(error);
  }
});

router.post("/compose", async (req, res) => {
  try {
    const { postOption, postName, postTitle, postBody } = req.body;
    let imageSrc = "";
    if (postOption === "Football") {
      imageSrc = "/images/football/football-post-img.jpg";
    } else if (postOption === "Tennis") {
      imageSrc = "/images/tennis/tennis-post-img.jpg";
    } else if (postOption === "Fitness") {
      imageSrc = "/images/fitness/fitness-img2.jpg";
    }

    const newArticle = new Article({
      image: imageSrc,
      sportType: postOption,
      author: postName,
      title: postTitle,
      content: postBody,
      comments: [],
    });

    await Article.create(newArticle);

    res.redirect("/?post=true");
  } catch (error) {
    console.log(error);
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    const requestedId = req.params.id;
    const article = await Article.findById({ _id: requestedId });
    const locals = {
      title: article.title,
    };
    res.render("post", { locals, article });
  } catch (error) {
    console.log(error);
  }
});

router.get("/edit/post/:id", async (req, res) => {
  try {
    const requestedId = req.params.id;
    const article = await Article.findById({ _id: requestedId });
    const locals = {
      title: article.title,
    };
    res.render("edit", { locals, article });
  } catch (error) {
    console.log(error);
  }
});

router.post("/edit/post/:id", async (req, res) => {
  try {
    const { postOption, postName, postTitle, postBody } = req.body;
    let imageSrc = "";
    if (postOption === "Football") {
      imageSrc = "/images/football/football-post-img.jpg";
    } else if (postOption === "Tennis") {
      imageSrc = "/images/tennis/tennis-post-img.jpg";
    } else if (postOption === "Fitness") {
      imageSrc = "/images/fitness/fitness-img2.jpg";
    }

    await Article.findByIdAndUpdate(req.params.id, {
      image: imageSrc,
      sportType: postOption,
      author: postName,
      title: postTitle,
      content: postBody,
      updatedAt: Date.now(),
    });
    res.redirect(`/post/${req.params.id}?update=true`);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/edit/post/:id", async (req, res) => {
  try {
    await Article.deleteOne({ _id: req.params.id });
    console.log("Article deleted successfully");
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
  }
});

// Comments

router.post("/post/:id", async (req, res) => {
  try {
    const { commentName, commentText } = req.body;
    const newComment = new Comment({
      username: commentName,
      content: commentText,
    });

    await newComment.save();

    const article = await Article.findById(req.params.id);
    if (article) {
      article.comments.push(newComment);
      await article.save();
      res.redirect(`/post/${req.params.id}`);
    } else {
      res.status(404).send("Article not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

router.put("/post/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const articles = await Article.find();
    for (let j = 0; j < articles.length; j++) {
      for (let i = 0; i < articles[j].comments.length; i++) {
        if (articles[j].comments[i]._id.valueOf() === req.params.id) {
          console.log("found it");
          articles[j].comments.splice(i, j);
          console.log("deleted");
          await articles[j].save();
          console.log(articles[j].comments);
        }
      }
    }
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
