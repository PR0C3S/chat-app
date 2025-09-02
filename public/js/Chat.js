const socket = io();

// ----- DOM elements -----
const $messageForm = document.querySelector("#message-form");
const $inputMessage = $messageForm.querySelector("#message");
const $inputName = $messageForm.querySelector("#name");
const $btnSendMessage = $messageForm.querySelector("#btnSendMessage");
const $chatContainer = document.querySelector("#chat-container");

// ----- Send chat message -----
$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const sender = $inputName.value.trim();
  const message = $inputMessage.value.trim();

  if (!sender || !message) return;

  $inputName.setAttribute("disabled", "disabled");
  $inputMessage.setAttribute("disabled", "disabled");
  $btnSendMessage.setAttribute("disabled", "disabled");

  socket.emit("send-message", { sender, message }, (error) => {
    if (error) return console.error(error);

    $btnSendMessage.removeAttribute("disabled");
    $inputMessage.removeAttribute("disabled");
    $inputMessage.value = "";
    $inputMessage.focus();
  });
});

// ----- Render chat messages -----
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

// ----- Show toast for alerts -----
function showToast(alert) {
  document.getElementById("toastMessage").textContent = alert.message;
  document.getElementById("toastId").textContent = alert.id;
  document.getElementById("toastLocation").textContent = alert.location;
  document.getElementById("toastTimestamp").textContent = alert.timestamp;

  const toastElement = document.getElementById("customToast");
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

// ----- Listen for chat messages -----
socket.on("message", (data) => {
  renderMessage({
    sender: data.sender,
    message: data.message,
    time: data.time,
    isMine: data.sender === $inputName.value,
  });
});

// ----- Listen for new alerts -----
socket.on("new-alert", (alert) => {
  showToast(alert);
});

// ----- Handle new alert form -----
document.querySelector("#new-alert-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = document.querySelector("#alertMessage").value.trim();
  const location = document.querySelector("#alertLocation").value.trim();
  if (!message || !location) return;

  socket.emit("create-alert", { message, location }, () => {
    e.target.reset();
    bootstrap.Modal.getInstance(
      document.querySelector("#modalNewAlert")
    ).hide();
  });
});

// ----- Load last 10 alerts into modal -----
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
