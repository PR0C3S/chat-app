import { CustomError } from "../errors/CustomError.js";
import { Alert } from "../models/Alert.js";
import { AlertRepositoryInstance } from "../repositories/AlertRepository.js";

export class AlertService {
  create = async (data) => {
    const { message, location } = data;

    if (!message) {
      throw new CustomError("Message is required.", 400);
    }

    if (!location) {
      throw new CustomError("Location is required.", 400);
    }

    const newAlert = new Alert(message, location);
    return AlertRepositoryInstance.create(newAlert);
  };
  delete = async (id) => {
    if (!id) {
      throw new CustomError("ID is required.", 400);
    }
    return AlertRepositoryInstance.delete(id);
  };
  findById = async (id) => {
    if (!id) {
      throw new CustomError("ID is required.", 400);
    }
    const alert = AlertRepositoryInstance.findById(id);
    if (!alert) {
      throw new CustomError(`Alert with ID '${id}' not found.`, 404);
    }
    return alert;
  };
  getAll = async () => {
    return AlertRepositoryInstance.getAll();
  };
  getTop10 = async () => {
    return AlertRepositoryInstance.getTop10();
  };
}

// Singleton instance
export const AlertServiceInstance = new AlertService();
