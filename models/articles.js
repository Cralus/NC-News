const { response } = require("../app");
const format = require('pg-format')
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
exports.fetchArticles = (topic, sortBy= "created_at", orderBy= "DESC"  ) => {

  const sortByGreenlist = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];
  const orderByGreenlist = ["ASC", "asc", "DESC", "desc"];
  const queryVals = []
  if (!sortByGreenlist.includes(sortBy)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (!orderByGreenlist.includes(orderBy)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const orderByString = `ORDER BY articles.${sortBy} ${orderBy}`
  let topicString = ``

  if(topic)
  {
    queryVals.push(topic);
    topicString = `WHERE topic = $1`;
  } 

    return db.query(`SELECT articles.*, COUNT(comment_id) :: INT
    AS comment_count 
    FROM articles 
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    ${topicString}
    GROUP BY articles.article_id
    ${orderByString};`, queryVals).then((articles)=>{
        return articles.rows
    })
}
