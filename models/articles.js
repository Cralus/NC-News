const { response } = require('../app');
const db = require('../db/connection');

exports.fetchArticlesById = (articleId) => {
    return db
    .query(
        `SELECT * FROM articles WHERE article_id = $1;`, [articleId]
    ).then((response) => {
        if(!response.rows.length)
        {
          return  Promise.reject({status: 404, msg: "Not Found"})
        }
        return response.rows[0]
    })
}
exports.updateArticlesById = (article, votes) => {
    article.votes += votes
    
    return db.query(
        `UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;`, [article.votes, article.article_id]
    ).then((article) => {    
        console.log(article)
        return article.rows[0]
    })
 }
//    return db
//     .query(
//         `SELECT * FROM articles WHERE article_id = $1;`, [article.article_id]
//     )