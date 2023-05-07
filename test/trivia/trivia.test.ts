import "mocha";
import request from "supertest";
import { app } from "../../src/index";
import { TriviaQuestion } from "../../src/bots/trivia/TriviaTypes";

describe("API - Trivia", function () {
  this.timeout(60000);

  let categories: string[] = [
    'research_and_library_science',
    'academic_disciplines',
    'culture_and_humanities',
    'arts_and_crafts',
    'food_and_drink',
    'visual_arts',
    'games',
    'performing_arts',
    'sports_and_recreation',
    'media',
    'geography',
    'health_and_wellness',
    'fitness',
    'medicine',
    'history',
    'activities_and_hobbies',
    'environment_and_conservation',
    'mathematics',
    'science',
    'nature',
    'demographics',
    'people',
    'psychology',
    'lifestyle',
    'philosophy',
    'cognition',
    'religion_and_spirituality',
    'computing_and_technology',
    'electronics'
  ]

  it("Should get categories", async function () {
    const answerResponse = await request(app)
      .post("/api/trivia")
      .send({
        method: "categories",
      })
      .expect(200)
      .expect("Content-Type", /json/);
    console.log("There are:" + answerResponse.body.categories.length + " categories");
    console.log(answerResponse.body.categories);
  });
  
  for (const category of categories) {
    let question: TriviaQuestion;
    it("Should create a new trivia question", async function () {
      const questionResponse = await request(app)
        .post("/api/trivia")
        .send({
          method: "question",
          category,
        })
        .expect(200)
        .expect("Content-Type", /json/);
      question = questionResponse.body.question;
      console.log({ category: question.category, sourceCategory: category, question: question.question, choices: question.choices });
    });

    it.skip("Should answer the trivia question", async function () {
      const answerResponse = await request(app)
        .post("/api/trivia")
        .send({
          method: "answer",
          question: question.id,
          answer: question.choices ? question.choices[0] : "I don't know",
        })
        .expect(200)
        .expect("Content-Type", /json/);
      const result = answerResponse.body.result;
    });
  }

  it.skip("Should keep score", async function () {
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
