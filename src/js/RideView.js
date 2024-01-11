class RideView {
  _parentElement;
  constructor(parentElement = '') {
    this._parentElement = document.querySelector(parentElement);
  }
  renderRide(current) {
    const markup = `<li class="ride" data-id="${current.timestamp}">
          <h2 class="workout__title">${current.date}</h2>
          <div class="workout__distance">
            <span class="workout__value">${current.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__description">
            <p>${current.description}Ceci est la description</p>
          </div></li>`;

    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }
}
export default new RideView('.rides');
