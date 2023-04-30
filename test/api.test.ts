import 'mocha';
import request from 'supertest';
import { app } from '../src/index';
let urls = [
  "https://github.com/dbradleyfl"
]
describe('API - Translate', function () {
  this.timeout(15000);
  it('should return a completion', async function () {
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
