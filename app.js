const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.js");
const { getArticlesById, patchArticlesById} = require("./controllers/articles.js");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);

app.use(express.json())

app.patch("/api/articles/:article_id", patchArticlesById)

app.use((err, req, res, next) => {
   
    if(err.code === '22P02')
    {
     res.status(400).send({msg: 'Bad Request'})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {

    res.status(err.status).send({ msg: err.msg });
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Bad endpoint" });
});

module.exports = app;
