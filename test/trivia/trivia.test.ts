import "mocha";
import request from "supertest";
import { app } from "../../src/index";
import { TriviaQuestion } from "../../src/trivia/TriviaTypes";

describe("API - Trivia", function () {
  this.timeout(60000);
  const newQuestions = 1
  for (let i = 0; i < newQuestions; i++) {
    let question: TriviaQuestion;
    it("Should create a new trivia question", async function () {
      const questionResponse = await request(app)
        .post("/api/trivia")
        .send({
          method: "question"
        })
        .expect(200)
        .expect("Content-Type", /json/);
      question = questionResponse.body.question;
    });

    it.skip("Should answer the trivia question", async function () {
      const answerResponse = await request(app)
        .post("/api/trivia")
        .send({
          method: "answer",
          question: question.id,
          answer: question.choices ? question.choices[0] : "I don't know"
        })
        .expect(200)
        .expect("Content-Type", /json/);
      const result = answerResponse.body.result;
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
