const socket = io();

const $messageForm = document.querySelector("#message-form");
const $inputMessage = $messageForm.querySelector("#message");
const $inputName = $messageForm.querySelector("#name");
const $btnSendMessage = $messageForm.querySelector("#btnSendMessage");
const $chatContainer = document.querySelector("#chat-container");

document.querySelector("#new-alert-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = document.querySelector("#alertMessage").value;
  const location = document.querySelector("#alertLocation").value;

  socket.emit("create-alert", { message, location }, (response) => {
    e.target.reset();
    bootstrap.Modal.getInstance(
      document.querySelector("#modalNewAlert")
    ).hide();
  });
});

document
  .querySelector("#modalLastAlerts")
  .addEventListener("show.bs.modal", async () => {
    try {
      const res = await fetch("http://localhost:3000/alerts/history");
      const alerts = await res.json();

      const list = document.querySelector("#alertsList");
      list.innerHTML = "";

      if (!alerts || alerts.length === 0) {
        list.innerHTML = `<li class="list-group-item text-muted">No hay alertas</li>`;
        return;
      }

      alerts.forEach((a) => {
        const item = `
          <li class="list-group-item">
            <strong>${a.message}</strong>
            <div class="small text-muted">
              ID: ${a.id} | ${a.location} | ${a.timestamp}
            </div>
          </li>`;
        list.insertAdjacentHTML("beforeend", item);
      });
    } catch (err) {
      console.error("Error cargando alertas:", err);
    }
  });

document
  .querySelector("#new-alert-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = document.querySelector("#alertMessage").value;
    const location = document.querySelector("#alertLocation").value;

    try {
      const res = await fetch("http://localhost:3000/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, location }),
      });

      if (!res.ok) throw new Error("Error creando alerta");
      const data = await res.json();
      e.target.reset();

      bootstrap.Modal.getInstance(
        document.querySelector("#modalNewAlert")
      ).hide();
    } catch (err) {
      console.error(err);
    }
  });

function sendMessage(message) {
  socket.emit("send-message", message);
}

function renderMessage({ sender, message, time, isMine }) {
  const bubble = `
    <div class="d-flex ${
      isMine ? "justify-content-end" : "justify-content-start"
    } mb-2">
      <div class="p-2 ${
        isMine ? "bg-primary text-white" : "bg-secondary text-white"
      } rounded-3" style="max-width: 70%">
        <div><strong>${isMine ? "Yo" : sender}</strong></div>
        <div>${message}</div>
        <div class="small text-light opacity-75 ${
          isMine ? "text-end" : ""
        }">${time}</div>
      </div>
    </div>
  `;
  $chatContainer.insertAdjacentHTML("beforeend", bubble);
  $chatContainer.scrollTop = $chatContainer.scrollHeight;
}

function showToast(alert) {
  document.getElementById("toastMessage").textContent = alert.message;
  document.getElementById("toastId").textContent = alert.id;
  document.getElementById("toastLocation").textContent = alert.location;
  document.getElementById("toastTimestamp").textContent = alert.timestamp;

  const toastElement = document.getElementById("customToast");
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

socket.on("message", (data) => {
  renderMessage({
    sender: data.sender,
    message: data.message,
    time: data.time,
    isMine: data.sender === $inputName.value,
  });
});

socket.on("new-alert", (alert) => {
  showToast(alert);
});
