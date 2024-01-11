import Ride from './Ride';
/**
 * @description Handle Cycling type
 * @class
 * @extends Workout
 */
export default class Cycling extends Ride {
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calcSpeed();
    this.type = 'cycling';
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
