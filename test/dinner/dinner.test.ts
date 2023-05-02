import "mocha";
import request from "supertest";
import { app } from "../../src/index";

describe("API - Dinner", function () {
  this.timeout(15000);
  
  const firstPrompt =
    "Respond with a recipe for dinner for 2 adult men that can be cooked in 30 minutes. Do not ask questions.";
  const secondPrompt =
    "Can you do the portions of each item and esitimate the cost?";

    it("should init", async function () {
        const res = await request(app)
          .post("/api/actions/memorable")
          .send({
            content: "hello chef.",
            id: "dinner",
            uid: "1234",
          })
          .expect(200)
          .expect("Content-Type", /json/);
        const result = res.body.result;
        console.log(result);
      });
  it("should suggest a menu item", async function () {
    const res = await request(app)
      .post("/api/actions/memorable")
      .send({
        content: firstPrompt,
        id: "dinner",
        uid: "1234",
      })
      .expect(200)
      .expect("Content-Type", /json/);
    const result = res.body.result;
    console.log(result);
  });
  it("should remember the recipe", async function () {
    const res = await request(app)
      .post("/api/actions/memorable")
      .send({
        content: secondPrompt,
        id: "dinner",
        uid: "1234",
      })
      .expect(200)
      .expect("Content-Type", /json/);
    const result = res.body.result;
    console.log(result);
  });
  it("should forget this recipe", async function () {
    const res = await request(app)
      .delete("/api/actions/memorable")
      .send({
        id: "dinner",
        uid: "1234",
      })
      .expect(200)
      .expect("Content-Type", /json/);
    const result = res.body.result;
    console.log({ result });
  });
});
