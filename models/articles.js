const db = require('../db/connection');

exports.fetchArticlesById = (parameter) => {
    return db
    .query(
        `SELECT * FROM articles WHERE article_id = $1`, [parameter.article_id]
    ).then((response) => {
        if(!response.rows.length)
        {
          return  Promise.reject({status: 404, msg: "Not Found"})
        }
        return response.rows[0]
    })
}