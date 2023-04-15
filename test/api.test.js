import request from 'supertest';
import {app} from '../src/index.js';
let urls = [
  "https://markdown.space/"
]
//test the localhost server at 3000 port
// describe('API', async function() {
//     this.timeout(50000); // Adjust the number to a suitable value (in milliseconds)
//     it('should return a completion', async function() {
//       for (let url of urls) {
//         const res = await request(app)
//         .post('/')
//         .send({
//           url,
//         })
//         .expect(200) // check that the status code is 200 OK
//         .expect('Content-Type', /json/);

//         console.log(res.body.result)
//       }
//     });
// });

//test the identify endpoint
describe('API', async function() {
    this.timeout(50000); // Adjust the number to a suitable value (in milliseconds)
    it('should return a completion', async function() {
      for (let url of urls) {
        const res = await request(app)
        .post('/identify')
        .send({
          url,
        })
        .expect(200) // check that the status code is 200 OK
        .expect('Content-Type', /json/);

        console.log(res.body.result)
      }
    });
});
