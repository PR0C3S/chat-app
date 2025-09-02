import { CustomError } from "../errors/CustomError.js";
import { Alert } from "../models/Alert.js";
import { AlertRepository } from "../repositories/AlertRepository.js";

export class AlertService {
  constructor() {
    this.alertRepository = new AlertRepository();
  }
  create = async (data) => {
    const { message, location } = data;

    if (!message) {
      throw new CustomError("Message is required.", 400);
    }

    if (!location) {
      throw new CustomError("Location is required.", 400);
    }

    const newAlert = new Alert(message, location);
    return this.alertRepository.create(newAlert);
  };
  delete = async (id) => {
    if (!id) {
      throw new CustomError("ID is required.", 400);
    }
    return this.alertRepository.delete(id);
  };
  findById = async (id) => {
    if (!id) {
      throw new CustomError("ID is required.", 400);
    }
    const alert = this.alertRepository.findById(id);
    if (!alert) {
      throw new CustomError(`Alert with ID '${id}' not found.`, 404);
    }
    return alert;
  };
  getAll = async () => {
    return this.alertRepository.getAll();
  };
  getTop10 = async () => {
    return this.alertRepository.getTop10();
  };
}
