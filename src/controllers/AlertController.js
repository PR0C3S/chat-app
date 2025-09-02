import { getSocket } from "../plugins/Socket.js";
import { AlertServiceInstance } from "../services/AlertService.js";

export class AlertController {
  getTop10 = async (req, res) => {
    try {
      const last10 = await AlertServiceInstance.getTop10();
      res.status(200).json(last10.reverse());
    } catch (err) {
      res
        .status(500)
        .json({ message: err.message || "Error al obtener alertas" });
    }
  };

  createAlert = async (req, res) => {
    try {
      // Create alert via service
      const newAlert = await AlertServiceInstance.create(req.body);

      // Emit alert to all clients
      const io = getSocket();
      io.emit("new-alert", newAlert);

      res.status(201).json(newAlert);
    } catch (err) {
      res
        .status(err.statusCode || 500)
        .json({ message: err.message || "Error creando alerta" });
    }
  };
}
