process.env.NODE_ENV = "test";
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const db = require("../db/connection.js");
const app = require("../app.js");
const request = require("supertest");

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
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z", //There is a utility class tranlating a time stamp into date
          votes: 100,
        });
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
