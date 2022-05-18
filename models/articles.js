const { response } = require("../app");
const db = require("../db/connection");

exports.fetchArticlesById = (articleId) => {
 return db.query(
    `SELECT articles.*, COUNT(comment_id) :: INT
    AS comment_count 
    FROM articles 
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
    [articleId]
  ).then(
    (articleResponse) => {
      const article = articleResponse.rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      console.log(article)
      return article;
    }
  );
};
exports.updateArticlesById = (article, votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes+$1 WHERE article_id = $2 RETURNING *;`,
      [votes, article]
    )
    .then((article) => {
      if (!article.rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return article.rows[0];
    });
};
