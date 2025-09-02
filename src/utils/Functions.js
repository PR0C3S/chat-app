import { Alert } from "../models/Alert.js";
import { AlertServiceInstance } from "../services/AlertService.js";

export const generateAlert = async () => {
  const alert = await AlertServiceInstance.create(
    new Alert("Intruder detected", "North Gate")
  );
  return alert;
};
