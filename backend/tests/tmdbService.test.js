const test = require('node:test');
const assert = require('node:assert/strict');

const TMDBService = require('../src/services/tmdbService');

test('normalizeMovieGenres: TMDB object array', () => {
  const svc = new TMDBService();
  const genres = svc.normalizeMovieGenres([{ id: 28, name: 'Action' }]);
  assert.deepEqual(genres, [{ id: 28, name: 'Action' }]);
});

test('normalizeMovieGenres: comma-separated string', () => {
  const svc = new TMDBService();
  const genres = svc.normalizeMovieGenres('Drama, Crime');
  assert.equal(genres.length, 2);
  assert.equal(genres[0].name, 'Drama');
  assert.equal(genres[1].name, 'Crime');
});

test('normalizeMovieGenres: numeric id array', () => {
  const svc = new TMDBService();
  const genres = svc.normalizeMovieGenres([28, 12]);
  assert.equal(genres.length, 2);
  assert.equal(genres[0].id, 28);
  assert.equal(genres[1].id, 12);
});

test('normalizeMovieGenres: empty / null', () => {
  const svc = new TMDBService();
  assert.deepEqual(svc.normalizeMovieGenres(null), []);
  assert.deepEqual(svc.normalizeMovieGenres(''), []);
});

test('getSampleMovieDetails: resolves genres and core fields', async () => {
  const svc = new TMDBService();
  const details = await svc.getSampleMovieDetails(550);
  assert.equal(details.title, 'Fight Club');
  assert.ok(Array.isArray(details.genres));
  assert.ok(details.genres.length > 0);
  assert.equal(details.genres[0].name, 'Drama');
});
