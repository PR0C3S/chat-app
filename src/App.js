import express from "express";
import { createServer } from "node:http";
import cors from "cors";
import { createAlertRoutes } from "./routes/AlertRoutes.js";
import { generateAlert } from "./utils/functions.js";
import { initSocket } from "./plugins/Socket.js";

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("public"));

const io = initSocket(server);

app.use("/alerts", createAlertRoutes());

app.use((req, res) => {
  res.status(404).json({ message: `Can't find ${req.originalUrl}` });
});

setInterval(async () => {
  const alert = await generateAlert();
  io.emit("new-alert", alert);
}, 10000);

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
