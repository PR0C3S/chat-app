import { getSocket } from "../plugins/Socket.js";
import { AlertRepositoryInstance } from "../repositories/AlertRepository.js";

export class AlertController {
  getTop10 = (req, res) => {
    try {
      const last10 = AlertRepositoryInstance.getTop10().reverse();
      res.status(200).json(last10);
    } catch (err) {
      res.status(500).json({ message: "Error al obtener alertas" });
    }
  };

  createAlert = (req, res) => {
    try {
      const { message, location } = req.body;
      if (!message || !location) {
        return res.status(400).json({ message: "Faltan campos" });
      }

      const newAlert = {
        id: Date.now(),
        message,
        location,
        timestamp: new Date().toISOString(),
      };

      AlertRepositoryInstance.create(newAlert);

      // Emitir alerta a todos los clientes conectados
      const io = getSocket();
      io.emit("new-alert", newAlert);

      res.status(201).json(newAlert);
    } catch (err) {
      res.status(500).json({ message: "Error creando alerta" });
    }
  };
}
