'use strict';

/* IMPROVEMENTS
https://www.udemy.com/course/the-complete-javascript-course/learn/lecture/22649267#overview
 */
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
//
class Workout {
  // Be careful that this method is yet implemented.
  date = new Date();
  type = '';
  // Create an unique id.
  // Convert this to string: get the 10 last numbers.
  id = (Date.now() + '').slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lgn]
    this.distance = distance; // km
    this.duration = duration; // min
  }
  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}
class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this.type = 'running';
    this._setDescription();
  }
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calcSpeed();
    this.type = 'cycling';
    this._setDescription();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
/* const run1 = new Running([50.8008128, 4.3828024], 15, 180, 178);
const cycling1 = new Cycling([50.8008128, 4.3828024], 15, 30, 523);
console.log(run1, cycling1); */
///////// APPLICATION ARCHITECTURE /////////
class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvt;
  #marker;
  #workout = [];
  constructor() {
    // All methods into constructor are triggered on instanciation.
    this._getPosition();

    // Form's events
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toogleElevationField.bind(this));
    // Workout's Event
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }
  _getPosition() {
    // Geolocalisation.
    // 2 callback functions (success & error).
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert(`Could not retrieve current position.`);
        }
      );
    }
  }
  _loadMap(position) {
    //TODO IMPROVE
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    this.#map = L.map('map').setView([latitude, longitude], this.#mapZoomLevel);
    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    L.marker([latitude, longitude], {
      opacity: 1,
    })
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          autoClose: false,
          closeOnClick: false,
        })
      )
      .setPopupContent('My location')
      .openPopup();
    // Get datas from local storage
    this._getLocalStorage();
    // Leaflet API
    // Click on the map event
    this.#map.on('click', this._showForm.bind(this));
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
  _newWorkout(e) {
    e.preventDefault();
    // Validation
    const validation = (...inputs) =>
      inputs.every(input => Number.isFinite(input));
    const allPositive = (...inputs) => inputs.every(input => input > 0);
    // Get date from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const coords = Object.values(this.#mapEvt.latlng);
    let workout;
    // CREATE RUNNING OBJECT or CYCLING OBJECT
    if (type == 'running') {
      const cadence = +inputCadence.value;
      // Check if date is  valid
      if (
        !validation(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        return alert('Inputs must be positive numbers');
      }

      //coords, distance, duration, cadence
      workout = new Running(coords, distance, duration, cadence);
    }
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (
        !validation(distance, duration, elevation) ||
        !allPositive(distance, duration, elevation)
      ) {
        return alert('Inputs must be valid numbers');
      }
      workout = new Cycling(coords, distance, duration, elevation);
    }
    // Add new object to workout array
    this.#workout.push(workout);
    // Render workout on map & list
    this._renderWorkoutPopup(workout);
    // Render workout description
    this._renderWorkout(workout);
    // Clear and hide form
    this._hideForm();
    // Set to local storage
    this._setLocalStorage();
  }
  _renderWorkoutPopup(workout) {
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
  }
  _renderWorkout(workout) {
    let html = `<li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">
      ${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} </span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>`;
    if (workout.type === 'running') {
      html += `<div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.pace.toFixed(1)}</span>
        <span class="workout__unit">min/km</span>
    </div>
    <div class="workout__details">
    <span class="workout__icon">🦶🏼</span>
    <span class="workout__value">${workout.cadence}</span>
    <span class="workout__unit">spm</span>`;
    }
    if (workout.type === 'cycling') {
      html += `<div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.speed.toFixed(1)}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value">${workout.elevation}</span>
        <span class="workout__unit">m</span>
      </div>`;
    }
    html += `</li>`;
    form.insertAdjacentHTML('afterend', html);
  }

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
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
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
    this.#workout.forEach(workout => {
      this._renderWorkout(workout);
      this.#marker = L.marker(workout.coords).addTo(this.#map);
      this._renderWorkoutPopup(workout);
    });
  }
  // Public function to empty local storage
  reset() {
    localStorage.removeItem('workout');
    location.reload();
  }
}
const app = new App();
