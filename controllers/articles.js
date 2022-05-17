const { fetchArticlesById, updateArticlesById } = require("../models/articles");

exports.getArticlesById = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticlesById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticlesById = (req, res, next) => {
  const articleId = req.params.article_id;
    if(!req.body.hasOwnProperty('inc_votes') || Object.keys(req.body).length !== 1)
    {
        next({status: 400, msg: "Bad Request"})
    }
  const votesToIncrement = req.body.inc_votes;
  fetchArticlesById(articleId)
    .then((article) => updateArticlesById(article, votesToIncrement))
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
