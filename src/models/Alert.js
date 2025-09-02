import { generateId } from "../plugins/Uuid.js";

export class Alert {
  constructor(message, location) {
    this.id = generateId();
    this.message = message;
    this.location = location;
    this.timestamp = new Date().toISOString();
  }
}
