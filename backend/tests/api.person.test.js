const test = require('node:test');
const assert = require('node:assert/strict');

const request = require('supertest');
const app = require('../src/app');

test('GET /api/movies/person/search rejects short query', async () => {
  const res = await request(app).get('/api/movies/person/search').query({ q: 'a' });
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
});

test('GET /api/movies/person/:id rejects invalid id', async () => {
  const res = await request(app).get('/api/movies/person/abc');
  assert.equal(res.status, 400);
});

test('GET /api/health returns 200', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
});

test('GET /api/movies/person/31 returns person payload', async () => {
  const res = await request(app).get('/api/movies/person/31');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data?.name);
});
