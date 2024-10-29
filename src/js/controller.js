import { MAPZOOM } from './config';
import { app, initApp } from './models/model';
import RideView from './views/RideView';
import MapView from './views/MapView';
import PopupView from './views/PopupView';
import { iconHome, iconMapty } from './models/icons';
import { getDistance, setLocalStorage } from './models/helper';

// Rides cart handlers.
const handleRidesClick = function (ride, isRemove) {
  const id = ride.dataset.id;
  let polylineId;
  const [polyline] = app.polylines.filter((item, index) => {
    polylineId = index;
    return item.options.className === `polyline-${id}`;
  });
  if (!isRemove) {
    ride.classList.toggle('highlighted');
    // Toggle Polyline style.
    MapView.togglePolylinePath(polyline);
    return;
  }
  //// Delete Ride. ////
  // Delete ride from app.rides
  app.rides.filter((item, index) => {
    item.timestamp === +id && app.rides.splice(index, 1);
  });
  // Delete ride element from DOM.
  ride.remove();
  // Delete polyline from app.polyline.
  app.polylines.splice(polylineId, 1);
  // Delete polyline from map.
  polyline.remove();
  // Update local storge.
  setLocalStorage(app.rides);
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
// Draw ride on map.
const toBeDispatched = function () {
  // Enable "Add new ride" button.
  RideView.handlerAddRide(handlerAddRide, true);
  // Populate sidebar display.
  RideView.renderRides(app.rides);
  RideView.handlerRidesClick(handleRidesClick);
  // Populate map's polylines display.
  app.rides.forEach(ride => {
    // Add paths
    const polyline = MapView.renderPolyline(ride);
    app.polylines.push(polyline);
    polyline.addTo(app.map);
    polyline.on('click', function (e) {
      app.map.panInsideBounds(polyline._bounds, {
        animate: true,
        pan: {
          duration: 0.5,
        },
      });
      // Find matching info.
      // TODO: make function (MapView.getRideId)
      const rideIdTab = e.sourceTarget.options.className.split('-');
      const rideId = rideIdTab[rideIdTab.length - 1];
      // TODO: make function.
      const rideInfo = document.querySelector(`[data-id = "${rideId}"]`);
      if (!rideInfo) {
        throw new Error('No info linked to this ride.');
      }
      // Reset.
      if (app.selected.includes(this)) {
        this.setStyle({ color: 'red', opacity: 0.2 });
        rideInfo.classList.remove('highlighted');
        const id = app.selected.indexOf(this);
        app.selected.splice(id, 1);
      }
      // Add.
      else {
        app.selected.push(this);
        this.setStyle({ color: '#000', opacity: 1.0 });
        rideInfo.classList.add('highlighted');
      }
    });
  });
};
const loadMap = function (geolocation) {
  const { latitude: lat, longitude: lgn } = geolocation.coords;
  app.homeCoords = [lat, lgn];
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
    .setPopupContent(`Home`)
    .openPopup();
  // Get datas from local storage.
  toBeDispatched();
};
const closePath = function (steps = []) {
  steps.push(app.homeCoords);
};

// HANDLERS //
const controlLoadMap = function () {
  getPosition();
};
const handlerAddRide = function () {
  // Disable "Add new ride" button.
  RideView.handlerAddRide(handlerAddRide, false);
  // Add an id.
  app.current.timestamp = Date.now();
  let steps = [app.homeCoords];
  app.current.marker = L.marker(app.homeCoords, {
    draggable: true,
    icon: iconMapty,
  }).addTo(app.map);

  // Create a red Polyline from an array of LatLng points.
  const polyline = L.polyline(steps, {
    color: 'red',
    opacity: 0.2,
    weight: 5,
    className: `polyline-${app.current.timestamp}`,
  });
  app.polylines.push(polyline);
  // Methods.
  // app.current.marker.on('dragend', function (e) {
  //   const latlng = Object.values(this.getLatLng());
  //   steps.push(latlng);
  //   // Update polyline.
  //   polyline.setLatLngs(steps).addTo(app.map);
  // });
  // Center again the map.
  app.current.marker.on('click', function (e) {
    app.map.setView(this.getLatLng(), MAPZOOM);
  });
  app.current.marker.on('drag', function (e) {
    const latlng = Object.values(this.getLatLng());
    steps.push(latlng);
    // Update polyline.
    polyline.setLatLngs(steps).addTo(app.map);
  });

  // Stop and calc distance on double click.
  app.current.marker.on('keyup', e => {
    // Key must be enter.
    if (e.originalEvent.keyCode != 13) {
      return;
    }
    // Remove last el of array.
    closePath(steps);
    // Stop map dragging.
    app.map.dragging.disable();
    // Update polyline.
    polyline.setLatLngs(steps).addTo(app.map);
    // Calcul total distance
    let distance = 0;
    steps.forEach((el, index, arr) => {
      if (index > 0) {
        const step = getDistance(
          el[0],
          el[1],
          arr[index - 1][0],
          arr[index - 1][1]
        );
        if (!isNaN(step)) {
          distance += step;
        }
      }
    });
    app.current.distance = distance.toFixed(3);
    app.current.steps = steps;
    app.current.date = new Date().toDateString();
    // Show Ride Popup.
    PopupView.open(handlerAddRideDesc, handlerClosePopup);
  });
  steps.splice(-1, 0);
};
// Popup form.
const textarea = document.getElementById('ride-popup__description');
const title = document.getElementById('ride-popup__title');
// Popup submit Event handler.
const handlerAddRideDesc = function (el) {
  // Check if app.current is empty.
  if (Object.keys(app.current).length === 0) {
    return;
  }
  // const textarea = document.getElementById('ride-popup__description');
  // const title = document.getElementById('ride-popup__title');
  app.current.title = title.value;
  app.current.description = textarea.value;
  // Create Ride cart.
  RideView.renderRide(app.current);
  // Reset form.
  title.value = '';
  textarea.value = '';
  // Remove marker.
  app.current.marker.remove();
  delete app.current.marker;
  // Add to localstorage.
  app.rides.push(app.current);
  setLocalStorage(app.rides);
  // Reset app.current
  app.current = {};
  // Enable "Add new ride" button.
  RideView.handlerAddRide(handlerAddRide, true);
  // Start map dragging.
  app.map.dragging.enable();
};
// Close Popup.
const handlerClosePopup = function () {
  // Remove marker.
  if (app.current.marker) {
    app.current.marker.remove();
    delete app.current.marker;
  }
  // Remove last polyline.
  const polyline = app.polylines.pop();
  if (polyline) {
    polyline.remove();
  }
  // Reset form.
  title.value = '';
  textarea.value = '';
  // Reset app.current.
  app.current = {};
  // Enable "Add new ride" button.
  RideView.handlerAddRide(handlerAddRide, true);
  // Start map dragging.
  app.map.dragging.enable();
};

// INIT
(function () {
  initApp();
  controlLoadMap();
})();
