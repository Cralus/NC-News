const { fetchCommentsByArticleId, addCommentByArticleId }= require('../models/comments')

exports.getCommentsByArticleId = (req, res, next) => {
    const articleId = req.params.article_id
    
   fetchCommentsByArticleId(articleId).then((comments) => {
       res.status(200).send({comments})
    }).catch((err) => {
        next(err);
    });
}

exports.postCommentByArticleId = (req, res, next) => {
    const comment = req.body
    const articleId = req.params.article_id
    addCommentByArticleId(comment, articleId).then((comment) => {
        res.status(201).send({comment})
    }).catch((err) => {
        next(err);
    })
}