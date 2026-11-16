import { getYear, parseGenres } from '../../utils';

export const getRuntime = (movie, omdbData) => {
  if (omdbData?.runtime) {
    return omdbData.runtime;
  }
  return movie.runtime ? `${movie.runtime} min` : 'N/A';
};

export const getReleaseInfo = (movie, omdbData) => {
  const tmdbYear = getYear(movie.release_date);
  const omdbYear = omdbData?.year;
  const omdbReleased = omdbData?.released;

  return {
    year: omdbYear || tmdbYear,
    fullDate: omdbReleased || movie.release_date,
    formatted:
      omdbReleased ||
      (movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'),
  };
};

export const getCombinedGenres = (movie, omdbData) => {
  const genres = parseGenres(movie.genres);
  const tmdbGenres = genres.map((g) => g.name);
  const omdbGenres = omdbData?.genre ? omdbData.genre.split(', ') : [];
  return [...new Set([...tmdbGenres, ...omdbGenres])];
};

export const getCombinedCast = (movie, omdbData) => {
  const tmdbCast = movie.cast || [];
  const omdbActors = omdbData?.actors ? omdbData.actors.split(', ') : [];

  return tmdbCast.length > 0
    ? tmdbCast
    : omdbActors.map((actor, index) => ({
        id: `omdb-${index}`,
        name: actor.trim(),
        character: 'N/A',
      }));
};

export const getCombinedCrew = (movie, omdbData) => {
  const tmdbCrew = movie.crew || [];
  const omdbDirector = omdbData?.director;
  const omdbWriter = omdbData?.writer;
  const combinedCrew = [...tmdbCrew];

  if (omdbDirector && !tmdbCrew.some((c) => c.job === 'Director' && c.name === omdbDirector)) {
    combinedCrew.push({
      id: 'omdb-director',
      name: omdbDirector,
      job: 'Director',
    });
  }

  if (omdbWriter && !tmdbCrew.some((c) => c.job === 'Writer' && c.name === omdbWriter)) {
    combinedCrew.push({
      id: 'omdb-writer',
      name: omdbWriter,
      job: 'Writer',
    });
  }

  return combinedCrew;
};

export const getCombinedPlot = (movie, omdbData) => {
  const tmdbOverview = movie.overview;
  const omdbPlot = omdbData?.plot;

  if (omdbPlot && omdbPlot.length > (tmdbOverview?.length || 0)) {
    return omdbPlot;
  }
  return tmdbOverview || omdbPlot;
};

export const getCombinedLanguages = (movie, omdbData) => {
  const tmdbLanguages = movie.spoken_languages || [];
  const omdbLanguage = omdbData?.language;

  const tmdbLangNames = tmdbLanguages.map((lang) => lang.english_name);
  const omdbLangNames = omdbLanguage ? omdbLanguage.split(', ') : [];

  return [...new Set([...tmdbLangNames, ...omdbLangNames])];
};

export const getCombinedCountries = (movie, omdbData) => {
  const tmdbCountries = movie.production_countries || [];
  const omdbCountry = omdbData?.country;

  return {
    codes: tmdbCountries.map((country) => country.iso_366_1),
    names: omdbCountry ? omdbCountry.split(', ') : [],
  };
};
