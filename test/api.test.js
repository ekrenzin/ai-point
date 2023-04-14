import request from 'supertest';
import {app} from '../src/index.js';
let urls = [
  'https://pages.markdown.space/dv-community/1681456254607',
  'https://pages.markdown.space/dv-community/1681427975412',
  'https://pages.markdown.space/dv-community/1681495769038',
]
//test the localhost server at 3000 port
describe('API', async function() {
    this.timeout(50000); // Adjust the number to a suitable value (in milliseconds)
    it('should return a completion', async function() {
      for (let url of urls)
        await request(app)
        .post('/')
        .send({
          url,
        })
        .expect(200) // check that the status code is 200 OK
        .expect('Content-Type', /json/); // check that the response is HTML
    });
});

//test the aws server at 300
