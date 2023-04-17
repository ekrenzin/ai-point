import request from 'supertest';
import { app } from '../src/index.js';
import { spanishText, docs } from '../src/mocks/actions.js';
let urls = [
  "https://github.com/dbradleyfl"
]
//test the localhost server at 3000 port
describe('API', async function () {
  this.timeout(50000); // Adjust the number to a suitable value (in milliseconds)
  it.skip('should return a completion', async function () {
    for (let url of urls) {
      const res = await request(app)
        .post('/')
        .send({
          url,
        })
        .expect(200) // check that the status code is 200 OK
        .expect('Content-Type', /json/);

      console.log(res.body.result)
    }
  });
});

//test translations
describe('API - Translate', async function () {
  this.timeout(50000); // Adjust the number to a suitable value (in milliseconds)
  it('should return a completion', async function () {
    const res = await request(app)
      .post('/api/actions')
      .send({
        content: spanishText,
        action: 'translate'
      })
      .expect(200) // check that the status code is 200 OK
      .expect('Content-Type', /json/);
    const result = res.body.result
    console.log({ result })
  });
});

//test jsdoc
describe('API - JSDoc', async function () {
  this.timeout(50000); // Adjust the number to a suitable value (in milliseconds)
  it('should return a completion', async function () {
    const res = await request(app)
      .post('/api/actions')
      .send({
        content: docs,
        action: 'jsdoc'
      })
      .expect(200) // check that the status code is 200 OK
      .expect('Content-Type', /json/);
    const result = res.body.result
    console.log({ result })
  });
})
