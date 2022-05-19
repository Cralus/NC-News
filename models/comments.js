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
exports.addCommentByArticleId = (comment, articleId) => {
    if(!comment.hasOwnProperty('username') || !comment.hasOwnProperty('body'))
    {
        return Promise.reject({ status: 400, msg: "Bad Request" });
    }
    if(typeof comment.body !== 'string')
    {
        return Promise.reject({ status: 400, msg: "Bad Request" });
    }
  return db
    .query(
      `INSERT INTO comments(author, body, article_id) VALUES($1, $2, $3) RETURNING*;`,
      [ comment.username, comment.body, articleId]
    ).then((response) => {
        return response.rows[0]
    })
};
