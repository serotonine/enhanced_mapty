import icons from '../../img/icons.svg';

class RideView {
  _parentElement;
  _rides;
  constructor(parentElement = '') {
    this._parentElement = document.querySelector(parentElement);
  }
  //// HANDLERS ////
  handlerAddRide(handler, isListen) {
    const addRide = document.querySelector('.btn--add-ride');
    if (isListen) {
      addRide.addEventListener('click', handler);
      addRide.classList.add('active');
    } else {
      addRide.removeEventListener('click', handler);
      addRide.classList.remove('active');
    }
  }
  handlerRidesClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const ride = e.target.closest('.ride');
      if (!ride) {
        return;
      }
      const removeBtn = e.target.closest('.ride__remove');
      const toRemove = removeBtn ? true : false;
      handler(ride, toRemove);
    });
  }
  handlerRemoveRide(handler) {
    document.querySelector('.ride__remove').addEventListener('click', e => {
      const ride = e.target.closest('.ride');
      if (!ride) {
        return;
      }
      handler(ride);
    });
  }

  //// MARKUP ////
  renderRides(rides) {
    rides.forEach(ride => {
      this.renderRide(ride);
    });
  }
  renderRide(current) {
    const markup = `<li class="ride" data-id="${current.timestamp}">
          <h2 class="ride__date">${current.date}</h2>
          <div class="ride__distance">
            <span class="ride__value">${current.distance}</span>
            <span class="ride__unit">km</span>
          </div>
         
          <h3 class="ride__title">${current.title}</h3>
         
          <div class="ride__description">
            <p>${current.description}</p>
          </div>
          <div class="btn__rounded ride__remove">
          <svg class="ride__delete-icon">
          <use href="${icons}#icon-delete"></use>
        </svg></div>
          </li>`;

    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }
}
export default new RideView('.rides');
