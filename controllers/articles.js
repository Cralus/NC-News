const { fetchArticlesById } = require("../models/articles");

exports.getArticlesById = (req, res, next) => {
  const parameter = req.params;
  fetchArticlesById(parameter)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
        next(err)
    });
};
