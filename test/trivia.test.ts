import "mocha";
import request from "supertest";
import { app } from "../src/index";

const NUMBER_OF_QUESTIONS = 5;
describe("API - Trivia", function () {
  this.timeout(15000);

  it("Should return a new trivia question", async function () {
    const res = await request(app)
      .post("/api/actions/memorable")
      .send({
        content: "give me a trivia question.",
        id: "trivia",
        uid: "1234",
      })
      .expect(200)
      .expect("Content-Type", /json/);
    const result = res.body.result;
    console.log(result);
  });

  it("Should answer the trivia question", async function () {
    const res = await request(app)

        .post("/api/actions/memorable")
        .send({
            content: "what is the answer?",
            id: "trivia",
            uid: "1234",
        })
        .expect(200)
        .expect("Content-Type", /json/);
    const result = res.body.result;
    console.log(result);
    });
    
  it("Should wipe the game", async function () {
    await request(app)
      .delete("/api/actions/memorable")
      .send({
        id: "trivia",
        uid: "1234",
      })
      .expect(200)
      .expect("Content-Type", /json/);
  });
});
