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
            expect(topic).toHaveProperty(
              "slug",                      
            );
            expect(topic).toHaveProperty(
                "description"                  
            );
          });
        });
    });

})

describe('GET /api/articles/:article_id', () => {
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
  test('should return a status of 404 not found when given an id that doesnt exist', () => {
    return request(app)
    .get("/api/articles/500697")
    .expect(404)
    .then(({body: {msg}}) => {
        expect(msg).toBe('Not Found')
    })
  });
  test('should return a status of 400 if not given a number and a msg of bad request', () => {
    return request(app)
    .get("/api/articles/notanumber")
    .expect(400)
    .then(({body: {msg}}) => {
        console.log(msg)
        expect(msg).toBe('Bad Request')
    })
  });
});
describe("Bad endpoint request error handling", () => {
        test("should respond with a status of 404 and a message of bad endpoint if given a not implemented endpoint", () => {
        return request(app)
          .get("/api/nothingtodowithus")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad endpoint');
          });
      });
})