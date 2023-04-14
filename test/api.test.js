import request from 'supertest';
import {app} from '../src/index.js';

const url = "https://markdown-cloud.devon.workers.dev/api/documents/b1ff2dc8-edef-471b-a987-9f671327d943"
//test the localhost server at 3000 port
describe('API', async function() {
    this.timeout(50000); // Adjust the number to a suitable value (in milliseconds)
    it('should return a completion', async function() {
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
