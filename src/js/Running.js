import Ride from './Ride';
/**
 * @description Handle Running type
 * @class
 * @extends Workout
 */
export default class Running extends Ride {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this.type = 'running';
  }
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
