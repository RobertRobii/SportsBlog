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

function insertArticleData() {
  Article.insertMany([
    {
      image: "/images/football/football-post-img.jpg",
      sportType: "Football",
      author: "Robert Raiovici",
      title: "News and significant events from the world of football",
      content:
        "Discover the latest updates and significant happenings from the dynamic realm of football worldwide. From major transfer announcements and managerial changes to pivotal match results and noteworthy achievements, stay informed about the pulse of the global football community. Delve into exclusive insights and captivating stories that capture the essence of the sport, highlighting the triumphs, controversies, and captivating narratives that shape the ever-evolving landscape of the beautiful game.",
    },
    {
      image: "/images/tennis/tennis-post-img.jpg",
      sportType: "Tennis",
      author: "Simona Halep",
      title: "News about top tennis tournaments and players' performances",
      content:
        "Stay updated with the latest news on the foremost tennis tournaments and the outstanding performances of the players. From the intense showdowns at Grand Slam events to the thrilling matches at prestigious ATP and WTA tournaments, the coverage includes insightful analyses of players' strategies, notable victories, and remarkable comebacks. Delve into the world of tennis as breaking news and in-depth reports shed light on the triumphs and challenges faced by the top-ranked athletes, showcasing their exceptional skills and unwavering determination on the court.",
    },
    {
      image: "/images/fitness/fitness-post-img.jpg",
      sportType: "Fitness",
      author: "Denisa Dragan",
      title: "Tips and guides for beginners on the correct training methods",
      content:
        "For beginners seeking to embark on a fitness journey, having access to effective training methods is paramount. With a myriad of tips and comprehensive guides available, individuals can learn the correct techniques for various exercises, ensuring optimal results and minimizing the risk of injuries. From emphasizing proper form in weightlifting to outlining structured cardio routines, these resources provide invaluable support for newcomers navigating the world of fitness. By adhering to these tips and incorporating the suggested training methodologies into their routines, beginners can establish a strong foundation for achieving their desired fitness goals and cultivating a sustainable, healthy lifestyle.",
    },
  ]);
}
insertArticleData();

module.exports = router;
