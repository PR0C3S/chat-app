import express from "express";
import { AlertController } from "../controllers/AlertController.js";

export const createAlertRoutes = () => {
  const router = express.Router();
  const controller = new AlertController();

  router.get("/history", (req, res) => controller.getTop10(req, res));
  router.post("/", (req, res) => controller.createAlert(req, res));

  return router;
};
