import { getDistance, getLocalStorage } from './helper';

export const app = {
  map: {},
  homeCoords: [],
  current: {},
  rides: [],
  polylines: [],
  selected: [],
};

export const initApp = function () {
  const datas = getLocalStorage();
  if (!datas) {
    return;
  }
  app.rides = datas;
};
