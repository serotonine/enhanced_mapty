import { MAPZOOM } from './config';
import RideView from './RideView';
import { iconHome } from './icons';
import Running from './Running';
import Cycling from './Cycling';
import { getDistance } from './helper';

/* IMPROVEMENTS
touch 
 */
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
//
const app = {
  map: {},
  homeCoords: [],
  current: {},
};
const getPosition = function () {
  // Geolocalisation.
  // 2 callback functions (success & error).
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(loadMap.bind(this), function () {
      alert(`Could not retrieve current position.`);
    });
  }
};
const loadMap = function (geolocation) {
  const { latitude: lat, longitude: lgn } = geolocation.coords;
  app.homeCoords = [lat, lgn];
  //TODO IMPROVE
  /*  const { latitude } = geolocation.coords;
  const { longitude } = geolocation.coords; */
  app.map = L.map('map').setView(app.homeCoords, MAPZOOM);

  L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(app.map);
  L.marker(app.homeCoords, {
    opacity: 1,
    icon: iconHome,
  })
    .addTo(app.map)
    .bindPopup(
      L.popup({
        autoClose: false,
        closeOnClick: false,
      })
    )
    .setPopupContent('My location')
    .openPopup();
  // Get datas from local storage
  //this._getLocalStorage();

  // Leaflet API
  // Click on the map event
  //app.map.on('click', this._showForm.bind(this));
};
const closePath = function (steps = []) {
  steps.pop();
  steps.push(app.homeCoords);
};

//const app = new App();
// CONTROLS
const controlLoadMap = function () {
  getPosition();
};
const controllAddRide = function () {
  /*  const { lat } = app.home;
  const { lng } = app.home; */
  // Get home coords.
  // const homeCoords = Object.values(app.home);
  let steps = [app.homeCoords];
  app.current.marker = L.marker(app.homeCoords, {
    draggable: true,
  }).addTo(app.map);

  // create a red polyline from an array of LatLng points
  const polyline = L.polyline(steps, {
    color: 'red',
    opacity: 0.2,
    weight: 5,
  });
  app.current.marker.on('dragend', function (e) {
    const coords = this.getLatLng();
    steps.push(Object.values(this.getLatLng()));
    // Update polyline.
    polyline.setLatLngs(steps).addTo(app.map);
  });
  // Stop and calc distance on double click.
  app.current.marker.on('dblclick', function (e) {
    //console.log(`polyline =>`, polyline);
    // Check that event is not an error
    if (!confirm('Is your ride complete ?')) {
      return;
    }
    // Add an id
    app.current.timestamp = Date.now();
    // Remove last el of array
    closePath(steps);
    // Update polyline.
    polyline.setLatLngs(steps).addTo(app.map);
    // Calcul total distance
    let distance = 0;
    steps.forEach((el, index, arr) => {
      if (index > 0) {
        step = getDistance(el[0], el[1], arr[index - 1][0], arr[index - 1][1]);
        distance += step;
      }
    });
    // Remove marker
    app.current.marker.remove();
    app.current.distance = distance.toFixed(3);
    app.current.polyline = polyline;
    app.current.date = new Date().toDateString();
    RideView.renderRide(app.current);
  });
  steps.splice(-1, 0);
  // console.log(`steps.pop() =>`, steps.pop());
  console.log(`steps =>`, steps);
};

// INIT
(function () {
  console.log(`INIT`);
  controlLoadMap();
  document
    .querySelector('.btn--add-ride')
    .addEventListener('click', controllAddRide);
})();

//////////// BACKUP //////////
/* const run1 = new Running([50.8008128, 4.3828024], 15, 180, 178);
const cycling1 = new Cycling([50.8008128, 4.3828024], 15, 30, 523);
console.log(run1, cycling1); */
///////// APPLICATION ARCHITECTURE /////////
class App {
  #map;
  #mapEvt;
  #marker;
  #workout = [];
  constructor() {
    // All methods into constructor are triggered on instanciation.
    /*     this._getPosition();
     */
    // Form's events
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toogleElevationField.bind(this));
    // Workout's Event
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }

  _showForm(mapEvt) {
    this.#mapEvt = mapEvt;
    // FORM
    form.removeAttribute('style');

    form.classList.remove('hidden');
    // Set focus on input distance
    inputDistance.focus();
    const coords = Object.values(mapEvt.latlng);
    this.#marker = L.marker(coords).addTo(this.#map);
  }
  _toogleElevationField(e) {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
  /*  _renderWorkoutPopup(workout, container) {
    this.#marker
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      ) // string or object
      .setPopupContent(
        `<span> ${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span> ${
          workout.description
        }`
      )
      .openPopup();
  } */

  _hideForm() {
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        '';
    form.style.display = 'none';
    form.classList.add('hidden');
  }
  _moveToPopup(e) {
    const workoutTarget = e.target.closest('.workout');
    if (!workoutTarget) {
      return;
    }
    const workout = this.#workout.find(
      item => item.id === workoutTarget.dataset.id
    );
    this.#map.setView(workout.coords, MAPZOOM, {
      animate: true,
      pan: {
        duration: 0.5,
      },
    });
  }
  _setLocalStorage() {
    // Don't use local storage to store large amount of datas.
    localStorage.setItem('workout', JSON.stringify(this.#workout));
  }
  _getLocalStorage() {
    // The local storage lost all inheritance.
    const datas = JSON.parse(localStorage.getItem('workout'));
    if (!datas) {
      return;
    }
    this.#workout = datas;
    this.#workout.forEach(data => {
      workout._renderWorkout(data, form);
      this.#marker = L.marker(data.coords).addTo(this.#map);
    });
  }
  // Public function to empty local storage
  reset() {
    localStorage.removeItem('workout');
    location.reload();
  }
}
