const { fetchArticlesById, updateArticlesById, fetchArticles } = require("../models/articles");
const { checkTopicExists } = require('../models/topics.js')
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
    updateArticlesById(articleId, votesToIncrement)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticles = (req, res, next) => { 
  const query = req.query;
  const promises = [fetchArticles(query.topic, query.sort_by, query.order)]
 if(query.topic)
  {
    promises.push(checkTopicExists(query.topic))
  }
  Promise.all(promises).then(([articles]) => {
    res.status(200).send({ articles });
  }).catch((err)=>{
    next(err)
  })
}
