import { Alert } from "../models/Alert.js";
import { AlertRepositoryInstance } from "../repositories/AlertRepository.js";

export const generateAlert = async () => {
  const alert = await AlertRepositoryInstance.create(
    new Alert("Intruder detected", "North Gate")
  );
  return alert;
};
