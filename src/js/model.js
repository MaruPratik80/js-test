import { getJSON } from './helper';

import config from './config';

export const state = {
  info: {},
  tabs: config.tabs,
  country: '',
  uni: {
    results: [],
    page: 1,
    resultsPerPage: 10,
  },
};

export const loadInfo = async function () {
  try {
    const data = await getJSON(config.api);
    state.info = data.results[0];
    state.country = state.info.location.country;
  } catch (err) {
    console.error(`${err} 💥💥`);
    throw err;
  }
};

export const loadUniversities = async function () {
  const data = await getJSON(
    `http://universities.hipolabs.com/search?country=${state.country.replaceAll(' ', '+')}`
  );
};
