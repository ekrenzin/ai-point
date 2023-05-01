import "mocha";
import request from "supertest";
import { app } from "../src/index";

describe("API - Threejs", function () {
  this.timeout(15000);

  it("Should write threejs boilerplate", async function () {
    const res = await request(app)
      .post("/api/actions/memorable")
      .send({
        content: "give me boilerplate for a threejs scene in html & js. Respond only with code.",
        id: "threejs",
        uid: "1234",
      })
      .expect(200)
      .expect("Content-Type", /json/);
    const result = res.body.result;
    console.log(result);
  });


  it("Add code for a cube", async function () {
    const res = await request(app)
        .post("/api/actions/memorable")
        .send({
            content: "write a function which adds a cube to the scene",
            id: "threejs",
            uid: "1234",
        })
        .expect(200)
        .expect("Content-Type", /json/);
    const result = res.body.result;
    console.log(result);
    });
    
  it("Should wipe the scene", async function () {
    await request(app)
      .delete("/api/actions/memorable")
      .send({
        id: "threejs",
        uid: "1234",
      })
      .expect(200)
      .expect("Content-Type", /json/);
  });
});
