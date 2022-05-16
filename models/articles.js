const db = require('../db/connection');

exports.fetchArticlesById = (articleId) => {
    return db
    .query(
        `SELECT * FROM articles WHERE article_id = $1`, [articleId]
    ).then((response) => {
        if(!response.rows.length)
        {
          return  Promise.reject({status: 404, msg: "Not Found"})
        }
        return response.rows[0]
    })
}