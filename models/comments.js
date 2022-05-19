const db = require("../db/connection");

exports.fetchCommentsByArticleId = (articleId) => {
  const doesArticleExist = db.query(
    `SELECT * FROM articles WHERE article_id = $1;`,
    [articleId]
  );
  const returnedComments = db.query(
    `SELECT * FROM comments WHERE article_id = $1;`,
    [articleId]
  );
  return Promise.all([doesArticleExist, returnedComments]).then(
    ([articlesResponse, commentsResponse]) => {
      if (articlesResponse.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return commentsResponse.rows;
    }
  );
};
