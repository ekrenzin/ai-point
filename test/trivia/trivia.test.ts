import "mocha";
import request from "supertest";
import { app } from "../../src/index";

describe("API - Trivia", function () {
  this.timeout(15000);

  const newQuestions = 3
  for (let i = 0; i < newQuestions; i++) {
    it("Should create a new trivia question", async function () {
      await request(app)
        .post("/api/trivia")
        .send({
          method: "question",
          chain: "4321",
          uid: "1234",
        })
        .expect(200)
        .expect("Content-Type", /json/);
    });

  }

  it("Should keep score", async function () {
    const res = await request(app)
      .post("/api/trivia")
      .send({
        method: "score",
        chain: "4321",
        uid: "1234",
      })
      .expect(200)
      .expect("Content-Type", /json/);
    const result = res.body.result;
    console.log({ result });
  });
});
