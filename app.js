const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.js");
const { getArticlesById, patchArticlesById, getArticles} = require("./controllers/articles.js");
const {getUsers} =require("./controllers/users")
const {getCommentsByArticleId, postCommentByArticleId} = require('./controllers/comments')

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/users", getUsers)
app.get("/api/articles", getArticles);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.use(express.json())

app.patch("/api/articles/:article_id", patchArticlesById)
app.post("/api/articles/:article_id/comments", postCommentByArticleId)
app.use((err, req, res, next) => {
   
    if(err.code === '22P02')
    {
     res.status(400).send({msg: 'Bad Request'})
    } else if(err.code === '23503'){
    res.status(404).send({msg: 'Not Found'})
    }
    else {
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
