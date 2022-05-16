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
              console.log(topic)
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