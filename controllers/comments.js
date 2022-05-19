const { fetchCommentsByArticleId }= require('../models/comments')

exports.getCommentsByArticleId = (req, res, next) => {
    const articleId = req.params.article_id
    
   fetchCommentsByArticleId(articleId).then((comments) => {
       res.status(200).send({comments})
    }).catch((err) => {
        next(err);
    });
}