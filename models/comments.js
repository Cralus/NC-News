const db = require("../db/connection");

exports.fetchCommentsByArticleId = (articleId) => {
    console.log(articleId)
    return db.query( `SELECT * FROM comments WHERE article_id = $1;`, [articleId] ).then((response) => {

        return response.rows
    })
}