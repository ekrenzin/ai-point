import 'mocha';
import request from 'supertest';
import { app } from '../src/index';

describe.skip('API - Memory', function () {
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
    console.log(result);
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
    console.log(result);
  });
  it('should remember my last question', async function () {
    const res = await request(app)
      .post('/api/actions/memorable')
      .send({
        content: "what was my last question?",
        id: "Ean",
        uid: "1234"
      })
      .expect(200)
      .expect('Content-Type', /json/);
    const result = res.body.result;
    console.log(result);
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
  it('should not remember me', async function () {
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
    console.log(result);
  });
  it('should forget I asked', async function () {
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