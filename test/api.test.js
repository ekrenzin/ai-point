const assert = require('assert')
const request = require('supertest')
const app = require('../index.js')

//test the localhost server at 3000 port
describe('API', async function() {
    this.timeout(50000); // Adjust the number to a suitable value (in milliseconds)
    it('should return a completion', async function() {
        await request(app)
        .get('/')
        .expect(200) // check that the status code is 200 OK
        .expect('Content-Type', /html/); // check that the response is HTML
    });
});

