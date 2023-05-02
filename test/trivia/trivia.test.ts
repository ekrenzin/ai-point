import "mocha";
import request from "supertest";
import { app } from "../../src/index";

describe("API - Trivia", function () {
  this.timeout(15000);

  for (let i = 0; i < 5; i++) {
    const questionPrompt = "give me a trivia question."
    const repeatPrompt = "repeat the question you asked most recently."
    const answerPrompt = "is the answer to the previous question 5?"

    it("Should return a new trivia question", async function () {
      const res = await request(app)
        .post("/api/memorable/trivia")
        .send({
          content: questionPrompt,
          chain: "4321",
          uid: "1234",
        })
        .expect(200)
        .expect("Content-Type", /json/);
      const result = res.body.result;
      console.log({questionPrompt, result});
    });

    it("should repeat the question", async function () {
      const res = await request(app)
      .post("/api/memorable/trivia")
        .send({
          content: repeatPrompt,
          chain: "4321",
          uid: "1234",
        })
        .expect(200)
        .expect("Content-Type", /json/);
      const result = res.body.result;
      console.log({repeatPrompt, result});
    });
    
    it("Should check the trivia answer", async function () {
      const res = await request(app)
        .post("/api/memorable/trivia")
        .send({
          content: answerPrompt,
          chain: "4321",
          uid: "1234",
        })
        .expect(200)
        .expect("Content-Type", /json/);
      const result = res.body.result;
      console.log({answerPrompt, result});
    });
  }

  it("Should wipe the game", async function () {
    await request(app)
      .delete("/api/memorable/trivia")
      .send({
        chain: "4321",
        uid: "1234",
      })
      .expect(200)
      .expect("Content-Type", /json/);
  });
});
