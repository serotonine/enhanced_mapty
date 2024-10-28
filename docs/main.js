/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/MapView.js":
/*!***************************!*\
  !*** ./src/js/MapView.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass MapView {\n  renderPolyline(ride) {\n    // create a red polyline from an array of LatLng points\n    return L.polyline(ride.steps, {\n      color: 'red',\n      opacity: 0.2,\n      weight: 5,\n      className: `polyline-${ride.timestamp}`,\n    });\n  }\n  togglePolylinePath(polyline) {\n    const { opacity } = polyline.options;\n    const options =\n      opacity == 0.2\n        ? { color: '#000', opacity: 1.0 }\n        : { color: 'red', opacity: 0.2 };\n    return polyline.setStyle(options);\n  }\n  getTotalBounds(polylines) {\n    const bounds = polylines.map(polyline => polyline.getCenter());\n    const bound = bounds.reduce(\n      (accumulator, current) => {\n        accumulator.lat += current.lat;\n        accumulator.lng += current.lng;\n        return accumulator;\n      },\n      { lat: 0, lng: 0 }\n    );\n    const moyenneLat = bound.lat / polylines.length;\n    const moyenneLng = bound.lng / polylines.length;\n    console.log([moyenneLat, moyenneLng]);\n    return [moyenneLat, moyenneLng];\n  }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new MapView());\n\n\n//# sourceURL=webpack://enhanced_mapty/./src/js/MapView.js?");

/***/ }),

/***/ "./src/js/RideView.js":
/*!****************************!*\
  !*** ./src/js/RideView.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _img_icons_svg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../img/icons.svg */ \"./src/img/icons.svg\");\n\n\nclass RideView {\n  _parentElement;\n  _rides;\n  constructor(parentElement = '') {\n    this._parentElement = document.querySelector(parentElement);\n  }\n  //// HANDLERS ////\n  handlerRidesClick(handler) {\n    this._parentElement.addEventListener('click', e => {\n      /*       console.log(`e.te.target`, e.target);\n       */\n      const ride = e.target.closest('.ride');\n      if (!ride) {\n        return;\n      }\n      const removeBtn = e.target.closest('.ride__remove');\n      const toRemove = removeBtn ? true : false;\n      handler(ride, toRemove);\n    });\n  }\n  handlerRemoveRide(handler) {\n    document.querySelector('.ride__remove').addEventListener('click', e => {\n      const ride = e.target.closest('.ride');\n      console.log(`removeBtn`, ride);\n      if (!ride) {\n        return;\n      }\n      handler(ride);\n    });\n    //delete item\n    // Delete path\n    // Update localStorage\n  }\n\n  //// MARKUP ////\n  renderRides(rides) {\n    rides.forEach(ride => {\n      this.renderRide(ride);\n    });\n  }\n  renderRide(current) {\n    const markup = `<li class=\"ride\" data-id=\"${current.timestamp}\">\n          <h2 class=\"ride__title\">${current.date}</h2>\n          <div class=\"ride__distance\">\n            <span class=\"ride__value\">${current.distance}</span>\n            <span class=\"ride__unit\">km</span>\n          </div>\n          <div class=\"ride__description\">\n            <p>${current.description}</p>\n          </div>\n          <div class=\"btn__rounded ride__remove\">\n          <svg class=\"ride__delete-icon\">\n          <use href=\"${_img_icons_svg__WEBPACK_IMPORTED_MODULE_0__}#icon-delete\"></use>\n        </svg></div>\n          </li>`;\n\n    this._parentElement.insertAdjacentHTML('beforeend', markup);\n  }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new RideView('.rides'));\n\n\n//# sourceURL=webpack://enhanced_mapty/./src/js/RideView.js?");

/***/ }),

/***/ "./src/js/config.js":
/*!**************************!*\
  !*** ./src/js/config.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   LOCALSTORAGEKEY: () => (/* binding */ LOCALSTORAGEKEY),\n/* harmony export */   MAPZOOM: () => (/* binding */ MAPZOOM),\n/* harmony export */   MONTHS: () => (/* binding */ MONTHS)\n/* harmony export */ });\nconst MAPZOOM = 20;\nconst LOCALSTORAGEKEY = 'rides';\nconst MONTHS = [\n  'January',\n  'February',\n  'March',\n  'April',\n  'May',\n  'June',\n  'July',\n  'August',\n  'September',\n  'October',\n  'November',\n  'December',\n];\n\n\n//# sourceURL=webpack://enhanced_mapty/./src/js/config.js?");

/***/ }),

/***/ "./src/js/controller.js":
/*!******************************!*\
  !*** ./src/js/controller.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ \"./src/js/config.js\");\n/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./model */ \"./src/js/model.js\");\n/* harmony import */ var _RideView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RideView */ \"./src/js/RideView.js\");\n/* harmony import */ var _MapView__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MapView */ \"./src/js/MapView.js\");\n/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./icons */ \"./src/js/icons.js\");\n/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./helper */ \"./src/js/helper.js\");\n\n\n\n\n\n\n\n/* IMPROVEMENTS\ntouch \n */\n\nconst ridePopup = document.getElementById('ride-popup');\n//\n/* const app = {\n  map: {},\n  homeCoords: [],\n  current: {},\n  rides: [],\n  polylines: [],\n  selected: [],\n}; */\nconst controlRidesClick = function (ride, isRemove) {\n  const id = ride.dataset.id;\n  let polylineId;\n  const [polyline] = _model__WEBPACK_IMPORTED_MODULE_1__.app.polylines.filter((item, index) => {\n    polylineId = index;\n    return item.options.className === `polyline-${id}`;\n  });\n  if (!isRemove) {\n    ride.classList.toggle('highlighted');\n    // Toggle Polyline style.\n    _MapView__WEBPACK_IMPORTED_MODULE_3__[\"default\"].togglePolylinePath(polyline);\n    return;\n  }\n  //// Delete Ride. ////\n  // update app.selected.\n  else {\n    // Delete ride from app.rides\n    _model__WEBPACK_IMPORTED_MODULE_1__.app.rides.filter((item, index) => {\n      item.timestamp === +id && _model__WEBPACK_IMPORTED_MODULE_1__.app.rides.splice(index, 1);\n    });\n    // Delete ride element from DOM.\n    ride.remove();\n    // Delete polyline from app.polyline.\n    _model__WEBPACK_IMPORTED_MODULE_1__.app.polylines.splice(polylineId, 1);\n    // Delete polyline from map.\n    polyline.remove();\n    // Update local storge.\n    setLocalStorage();\n  }\n};\nconst getPosition = function () {\n  // Geolocalisation.\n  // 2 callback functions (success & error).\n  if (navigator.geolocation) {\n    navigator.geolocation.getCurrentPosition(loadMap.bind(this), function () {\n      alert(`Could not retrieve current position.`);\n    });\n  }\n};\nconst toBeDispatched = function () {\n  // The local storage lost all inheritance.\n\n  // Populate sidebar display.\n  _RideView__WEBPACK_IMPORTED_MODULE_2__[\"default\"].renderRides(_model__WEBPACK_IMPORTED_MODULE_1__.app.rides);\n  _RideView__WEBPACK_IMPORTED_MODULE_2__[\"default\"].handlerRidesClick(controlRidesClick);\n  // Populate map's polylines display.\n  _model__WEBPACK_IMPORTED_MODULE_1__.app.rides.forEach(ride => {\n    // Add paths\n    const polyline = _MapView__WEBPACK_IMPORTED_MODULE_3__[\"default\"].renderPolyline(ride);\n\n    _model__WEBPACK_IMPORTED_MODULE_1__.app.polylines.push(polyline);\n    polyline.addTo(_model__WEBPACK_IMPORTED_MODULE_1__.app.map);\n    polyline.on('click', function (e) {\n      console.log(_model__WEBPACK_IMPORTED_MODULE_1__.app.map);\n      _model__WEBPACK_IMPORTED_MODULE_1__.app.map.panInsideBounds(polyline._bounds, {\n        animate: true,\n        pan: {\n          duration: 0.5,\n        },\n      });\n      // Find matching info.\n      // TODO: make function (MapView.getRideId)\n      const rideIdTab = e.sourceTarget.options.className.split('-');\n      const rideId = rideIdTab[rideIdTab.length - 1];\n      // TODO: make function.\n      const rideInfo = document.querySelector(`[data-id = \"${rideId}\"]`);\n      if (!rideInfo) {\n        throw new Error('No info linked to this ride.');\n        // Throw New error.\n      }\n      // Reset.\n      if (_model__WEBPACK_IMPORTED_MODULE_1__.app.selected.includes(this)) {\n        this.setStyle({ color: 'red', opacity: 0.2 });\n        rideInfo.classList.remove('highlighted');\n        const id = _model__WEBPACK_IMPORTED_MODULE_1__.app.selected.indexOf(this);\n        _model__WEBPACK_IMPORTED_MODULE_1__.app.selected.splice(id, 1);\n      }\n      // Add.\n      else {\n        _model__WEBPACK_IMPORTED_MODULE_1__.app.selected.push(this);\n        this.setStyle({ color: '#000', opacity: 1.0 });\n        rideInfo.classList.add('highlighted');\n      }\n    });\n  });\n};\nconst loadMap = function (geolocation) {\n  const { latitude: lat, longitude: lgn } = geolocation.coords;\n  _model__WEBPACK_IMPORTED_MODULE_1__.app.homeCoords = [lat, lgn];\n  _model__WEBPACK_IMPORTED_MODULE_1__.app.map = L.map('map').setView(_model__WEBPACK_IMPORTED_MODULE_1__.app.homeCoords, _config__WEBPACK_IMPORTED_MODULE_0__.MAPZOOM);\n\n  L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {\n    attribution:\n      '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\n  }).addTo(_model__WEBPACK_IMPORTED_MODULE_1__.app.map);\n  L.marker(_model__WEBPACK_IMPORTED_MODULE_1__.app.homeCoords, {\n    opacity: 1,\n    icon: _icons__WEBPACK_IMPORTED_MODULE_4__.iconHome,\n  })\n    .addTo(_model__WEBPACK_IMPORTED_MODULE_1__.app.map)\n    .bindPopup(\n      L.popup({\n        autoClose: false,\n        closeOnClick: false,\n      })\n    )\n    .setPopupContent('My location')\n    .openPopup();\n  // Get datas from local storage\n  toBeDispatched();\n};\nconst closePath = function (steps = []) {\n  steps.pop();\n  steps.push(_model__WEBPACK_IMPORTED_MODULE_1__.app.homeCoords);\n};\n\n//const app = new App();\n// CONTROLS\nconst controlLoadMap = function () {\n  getPosition();\n};\nconst controllAddRide = function () {\n  // Add an id\n  _model__WEBPACK_IMPORTED_MODULE_1__.app.current.timestamp = Date.now();\n  let steps = [_model__WEBPACK_IMPORTED_MODULE_1__.app.homeCoords];\n  _model__WEBPACK_IMPORTED_MODULE_1__.app.current.marker = L.marker(_model__WEBPACK_IMPORTED_MODULE_1__.app.homeCoords, {\n    draggable: true,\n  }).addTo(_model__WEBPACK_IMPORTED_MODULE_1__.app.map);\n\n  // create a red polyline from an array of LatLng points\n  const polyline = L.polyline(steps, {\n    color: 'red',\n    opacity: 0.2,\n    weight: 5,\n    className: `polyline-${_model__WEBPACK_IMPORTED_MODULE_1__.app.current.timestamp}`,\n  });\n\n  _model__WEBPACK_IMPORTED_MODULE_1__.app.current.marker.on('dragend', function (e) {\n    const latlng = Object.values(this.getLatLng());\n    steps.push(latlng);\n    // Update polyline.\n    polyline.setLatLngs(steps).addTo(_model__WEBPACK_IMPORTED_MODULE_1__.app.map);\n  });\n  // Stop and calc distance on double click.\n  _model__WEBPACK_IMPORTED_MODULE_1__.app.current.marker.on('dblclick', function (e) {\n    // Show Ride Popup\n    ridePopup.classList.remove('hidden');\n    // If Ride popup is submitted then let's go !\n    // Remove last el of array\n    closePath(steps);\n    // Update polyline.\n    polyline.setLatLngs(steps).addTo(_model__WEBPACK_IMPORTED_MODULE_1__.app.map);\n    // Calcul total distance\n    let distance = 0;\n    steps.forEach((el, index, arr) => {\n      if (index > 0) {\n        step = (0,_helper__WEBPACK_IMPORTED_MODULE_5__.getDistance)(el[0], el[1], arr[index - 1][0], arr[index - 1][1]);\n        distance += step;\n      }\n    });\n\n    _model__WEBPACK_IMPORTED_MODULE_1__.app.current.distance = distance.toFixed(3);\n    _model__WEBPACK_IMPORTED_MODULE_1__.app.current.steps = steps;\n    _model__WEBPACK_IMPORTED_MODULE_1__.app.current.date = new Date().toDateString();\n  });\n  steps.splice(-1, 0);\n};\nconst handlerAddRideDesc = function () {\n  ridePopup.addEventListener('submit', function (e) {\n    e.preventDefault();\n    const textarea = document.getElementById('ride_description');\n    _model__WEBPACK_IMPORTED_MODULE_1__.app.current.description = textarea.value;\n    this.classList.add('hidden');\n    // Remove marker\n    _model__WEBPACK_IMPORTED_MODULE_1__.app.current.marker.remove();\n    delete _model__WEBPACK_IMPORTED_MODULE_1__.app.current.marker;\n\n    _RideView__WEBPACK_IMPORTED_MODULE_2__[\"default\"].renderRide(_model__WEBPACK_IMPORTED_MODULE_1__.app.current);\n    // Add to localstorage.\n    _model__WEBPACK_IMPORTED_MODULE_1__.app.rides.push(_model__WEBPACK_IMPORTED_MODULE_1__.app.current);\n    setLocalStorage();\n    // Reset app.current\n    _model__WEBPACK_IMPORTED_MODULE_1__.app.current = {};\n  });\n};\nconst setLocalStorage = function () {\n  localStorage.setItem('rides', JSON.stringify(_model__WEBPACK_IMPORTED_MODULE_1__.app.rides));\n};\n// INIT\n(function () {\n  (0,_model__WEBPACK_IMPORTED_MODULE_1__.initApp)();\n  controlLoadMap();\n  document\n    .querySelector('.btn--add-ride')\n    .addEventListener('click', controllAddRide);\n  handlerAddRideDesc();\n})();\n\n\n//# sourceURL=webpack://enhanced_mapty/./src/js/controller.js?");

/***/ }),

/***/ "./src/js/helper.js":
/*!**************************!*\
  !*** ./src/js/helper.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getDistance: () => (/* binding */ getDistance),\n/* harmony export */   getLocalStorage: () => (/* binding */ getLocalStorage)\n/* harmony export */ });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ \"./src/js/config.js\");\n\n\nconst getDistance = function (lat1, lon1, lat2, lon2) {\n  if (lat1 == lat2 && lon1 == lon2) {\n    return;\n  }\n\n  const radlat1 = (Math.PI * lat1) / 180;\n  const radlat2 = (Math.PI * lat2) / 180;\n  const theta = lon1 - lon2;\n  const radtheta = (Math.PI * theta) / 180;\n  let dist =\n    Math.sin(radlat1) * Math.sin(radlat2) +\n    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);\n  if (dist > 1) {\n    dist = 1;\n  }\n  dist = Math.acos(dist);\n  dist = (dist * 180) / Math.PI;\n  dist = dist * 60 * 1.1515;\n  // Kilometers.\n  dist = dist * 1.609344;\n  return dist;\n};\n\nconst getLocalStorage = function () {\n  // The local storage lost all inheritance.\n  const datas = JSON.parse(localStorage.getItem(_config__WEBPACK_IMPORTED_MODULE_0__.LOCALSTORAGEKEY));\n  if (!datas) {\n    return;\n  }\n  return datas;\n};\n\n\n//# sourceURL=webpack://enhanced_mapty/./src/js/helper.js?");

/***/ }),

/***/ "./src/js/icons.js":
/*!*************************!*\
  !*** ./src/js/icons.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   iconHome: () => (/* binding */ iconHome)\n/* harmony export */ });\nconst iconHome = L.icon({\n  iconUrl: 'https://serotonine.alwaysdata.net/images/home.png',\n  iconSize: [48, 48],\n  iconAnchor: [12, 52],\n  popupAnchor: [-3, -76],\n});\n\n\n//# sourceURL=webpack://enhanced_mapty/./src/js/icons.js?");

/***/ }),

/***/ "./src/js/model.js":
/*!*************************!*\
  !*** ./src/js/model.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   app: () => (/* binding */ app),\n/* harmony export */   initApp: () => (/* binding */ initApp)\n/* harmony export */ });\n/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ \"./src/js/helper.js\");\n\n\nconst app = {\n  map: {},\n  homeCoords: [],\n  current: {},\n  rides: [],\n  polylines: [],\n  selected: [],\n};\n\nconst initApp = function () {\n  const datas = (0,_helper__WEBPACK_IMPORTED_MODULE_0__.getLocalStorage)();\n  if (!datas) {\n    return;\n  }\n  app.rides = datas;\n};\n\n\n//# sourceURL=webpack://enhanced_mapty/./src/js/model.js?");

/***/ }),

/***/ "./src/img/icons.svg":
/*!***************************!*\
  !*** ./src/img/icons.svg ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"542bcc5aa49edcb80ff8.svg\";\n\n//# sourceURL=webpack://enhanced_mapty/./src/img/icons.svg?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/controller.js");
/******/ 	
/******/ })()
;