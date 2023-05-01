import 'mocha';
import request from 'supertest';
import { app } from '../src/index';
let urls = [
  "https://github.com/dbradleyfl"
]
describe('API - Translate', function () {
  this.timeout(15000);
  it.skip('should return a completion', async function () {
    const res = await request(app)
      .post('/api/actions')
      .send({
        content: "TESTING 123",
        action: 'translate'
      })
      .expect(200)
      .expect('Content-Type', /json/);
    const result = res.body.result;
    console.log({ result });
  });
});

describe('API - Memory', function () {
  this.timeout(15000);
  it('should greet me', async function () {
    const res = await request(app)
      .post('/api/actions/memorable')
      .send({
        content: "Hi, my name is Ean. I am a software engineer.",
        id: "Ean",
        uid: "1234"
      })
      .expect(200)
      .expect('Content-Type', /json/);
    const result = res.body.result;
    console.log({ result });
  });
  it('should remember me', async function () {
    const res = await request(app)
      .post('/api/actions/memorable')
      .send({
        content: "what is my name and job?",
        id: "Ean",
        uid: "1234"
      })
      .expect(200)
      .expect('Content-Type', /json/);
    const result = res.body.result;
    console.log({ result });
  });
  it('should forget me', async function () {
    const res = await request(app)
      .delete('/api/actions/memorable')
      .send({
        id: "Ean",
        uid: "1234"
      })
      .expect(200)
      .expect('Content-Type', /json/);
    const result = res.body.result;
    console.log({ result });
  });
});