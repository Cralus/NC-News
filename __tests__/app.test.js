process.env.NODE_ENV = "test";
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const db = require("../db/connection.js");
const app = require("../app.js");
const request = require("supertest");
require('jest-sorted')
beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics get request", () => {
  test("should respond with a staus of 200 and an array of 3 topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
      });
  });
  test("should respond with a status of 200 and an array of topic objects each with a slug and a description property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("should return the specified article from the parametric endpoint", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(expect.objectContaining({ // david inspired refactor
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z", //There is a utility class tranlating a time stamp into date
          votes: 100,
        }),);
      });
  });
  test("should return a status of 404 not found when given an id that doesnt exist", () => {
    return request(app)
      .get("/api/articles/500697")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
  test("should return a status of 400 if not given a number and a msg of bad request", () => {
    return request(app)
      .get("/api/articles/notanumber")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("should respond with a status code of 200 and the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .expect(200)
      .send({ inc_votes: 20 })
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z", //There is a utility class tranlating a time stamp into date
          votes: 120,
        });
      });
  });
  test('should respond with a smaller number of voes if passed a negative number to increment', () => {
      return request(app)
      .patch("/api/articles/1")
      .expect(200)
      .send({ inc_votes: -10 })
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z", //There is a utility class tranlating a time stamp into date
          votes: 90,
        });
      });
  });
  test('Should respond with a 400 error if given a request body with the wrong property name of inc_votes', () => {
    return request(app)
    .patch("/api/articles/1")
    .expect(400)
    .send({ wrongName: 10 })
    .then(({ body: { msg } }) => {
         expect(msg).toBe('Bad Request')
    })
  });
  test('should respond with a 400 error if given an object with an incorrect datatype as the value for inc_votes', () => {
    return request(app)
    .patch("/api/articles/1")
    .expect(400)
    .send({ inc_votes: 'hello' })
    .then(({ body: { msg } }) => {
         expect(msg).toBe('Bad Request')
    })
  });
  test('should respond with a 400 error if given an object with two many properties as the request', () => {
    return request(app)
    .patch("/api/articles/1")
    .expect(400)
    .send({ wrongName: 10, shouldntbehere :10 })
    .then(({ body: { msg } }) => {
         expect(msg).toBe('Bad Request')
    })
  });
  test('should respond with a 404 error if given an article id which doesnt exist', () => {
    return request(app)
    .patch("/api/articles/5468498")
    .expect(404)
    .send({ inc_votes: 10 })
    .then(({ body: { msg } }) => {
         expect(msg).toBe('Not Found')
    })
  });  
  test("should return a status of 400 if article id isnt a number and a msg of bad request", () => {
    return request(app)
      .patch("/api/articles/notanumber")
      .expect(400)
      .send({ inc_votes: 10 })
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});
describe("/api/users get request", () => {
    test("should respond with a staus of 200 and an array of 4 user objects and have the right property", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4)
          users.forEach((user) => {
            expect(user).toHaveProperty("username");
          });
    });
  });
}) 
describe('GET /api/articles/:id comment count functionality', () => {
    test('should get respond with a status of 200 and an article by id with a comment count', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body: {article}}) => {
            expect(article).toHaveProperty('comment_count')
            expect(article.comment_count).toBe(11)            
        })
    });
    test('should get respond with a status of 200 and an article by id with a comment count of 0 for an article with no comments', () => {
        return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then(({body: {article}}) => {
            expect(article).toHaveProperty('comment_count')
            expect(article.comment_count).toBe(0)            
        })
    });
});
describe('GET /api/articles', () => {
    test('Should respond with a status code of 200 and an array of articles each with the expected properties within them', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body: {articles}}) => {
            expect(articles).toHaveLength(12)
            articles.forEach(article => {
                expect(article).toEqual(expect.objectContaining({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String), //There is a utility class tranlating a time stamp into date
                    votes: expect.any(Number),
                    comment_count: expect.any(Number)
                }))
            })
        })
    });
    test('should respond with a status code of 200 and an array of articles sorted by date in descending order ', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body: {articles}})=> {
            expect(articles).toBeSortedBy("created_at", {
                descending: true,
              });
        })
    });
});
describe('GET /api/articles/:article_id/comments', () => {
    test('Should respond with a status code of 200 and an array of comments which correspond to the article id and each have the expected properties', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body: {comments}}) => {
            expect(comments).toHaveLength(11)
            comments.forEach(comment => {
                expect(comment).toEqual(expect.objectContaining({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),  
                    created_at: expect.any(String), //There is a utility class tranlating a time stamp into date
                    author: expect.any(String),
                    body: expect.any(String),
                }))
            })
        })
    });
    test("should return a status of 400 if article id isnt a number and a msg of bad request", () => {
        return request(app)
          .get("/api/articles/notanumber/comments")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
    }); 
    test("should return a status of 404 if article id is a number but doesnt exist and a msg of no response", () => {
        return request(app)
          .get("/api/articles/1000000/comments")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not Found");
          });
    }); 
   test('should respond with a status of 200 if an article exists but has no comments', () => {
        return request(app)
        .get("/api/articles/10/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
        });
    });
})
describe('POST /api/articles/:article_id/comments', () => {
    test('should respond with a status code of 201 and the posted comment ', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .expect(201)
        .send({ username: 'butter_bridge', body: 'Thought provoking read!' })
        .then(({body: { comment }}) =>{
                expect(comment).toEqual(expect.objectContaining({
                    article_id: 1,
                    comment_id: expect.any(Number),
                    votes: 0,  
                    created_at: expect.any(String), //There is a utility class tranlating a time stamp into date
                    author: 'butter_bridge',
                    body: 'Thought provoking read!',
                }))
            
        })
        
    });
    test('should respond with a status code of 400 when given a bad article_id', () => {
        return request(app)
        .post('/api/articles/something/comments')
        .expect(400)
        .send({ username: 'butter_bridge', body: 'Thought provoking read!' })
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
    })
    test('should respond with a status code of 400 when given a article_id that doesnt exist', () => {
        return request(app)
        .post('/api/articles/1000000/comments')
        .expect(404)
        .send({ username: 'butter_bridge', body: 'Thought provoking read!' })
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Not Found");
          });
    })
    test('should respond with a status code of 404 when given a username that doesnt exist', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .expect(404)
        .send({ username: 'someone', body: 'Thought provoking read!' })
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Not Found");
          });
    })
    test('should respond with a status code of 400 when given a object which is missing required feilds', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .expect(400)
        .send({ username: 'butter_bridge' })
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
    })
    test('should respond with a status code of 400 when given the wrong datatype for body', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .expect(400)
        .send({ username: 'butter_bridge', body: 1 })
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
    })

});
describe('add query functionality GET /api/articles ', () => {
    test('Should respond with a an appropriately sorted array of articles', () => {
        return request(app)
        .get('/api/articles?sort_by=created_at&order=ASC')
        .expect(200)
        .then(({body: {articles}})=> {
            expect(articles).toBeSortedBy("created_at", {
                ascending: true,
            });
        });
    });
    test('Should respond with a an appropriately sorted array of articles when given a sort by which is not the default', () => {
        return request(app)
        .get('/api/articles?author=created_at')
        .expect(200)
        .then(({body: {articles}})=> {
            expect(articles).toBeSortedBy("created_at", {
                descending: true,
            });
        });
    });
    test('Should respond with a array of articles filtered by topic if given a topic query', () => {
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(({body: {articles}}) => {
            expect(articles).toHaveLength(1)
            expect(articles[0].topic).toEqual('cats')
        })
    })
    test('should respond with a status of 200 if an topic does exist but has no articles should return an empty array', () => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({body: {articles}}) => {
            expect(articles).toHaveLength(0)
        })
    });
     test('Should respond with a status of 404 if the requested topic doesnt exist', () => {
         return request(app)
         .get('/api/articles?topic=1')
         .expect(404)
        .then(({body: {msg}}) => {
             expect(msg).toBe('Not Found')
        
         })
     })
    test('Should respond with a status 400 if a query has a invalid column name to sort by', () => {
            return request(app)
            .get('/api/articles?sort_by=nonsense')
            .expect(400)
            .then(({body: {msg}})=> {
                expect(msg).toBe('Bad Request')
            });
    });
    test('Should respond with a status 400 if a query has a invalid string to order by but a valid column name to sort by', () => {
        return request(app)
        .get('/api/articles?sort_by=author&order=notDesc')
        .expect(400)
        .then(({body: {msg}})=> {
            expect(msg).toBe('Bad Request')
        });

});      
})
describe("Bad endpoint request error handling", () => {
  test("should respond with a status of 404 and a message of bad endpoint if given a not implemented endpoint", () => {
    return request(app)
      .get("/api/nothingtodowithus")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad endpoint");
      });
  });

});
