const request = require('supertest');
const app = require('../server');

describe('GET /', () => {
  it('responds 200 or redirect (served file)', async () => {
    const res = await request(app).get('/');
    expect([200, 302]).toContain(res.statusCode);
  });
});
