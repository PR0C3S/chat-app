
# Backend Technical Test – WebSocket Alert Server





## Overview
Build a backend WebSocket and REST API server to support the Real-Time Alert Dashboard
frontend.
This backend must generate alerts in a specific format, handle real-time chat messaging, and
expose REST endpoints for alert history and manual alert triggering.
## 💾 How Alerts and Chat Messages Are Handled

### Chat Messages
- Clients send messages via WebSocket `send-message`.
- Server broadcasts messages with `message` after filtering profanity.
- **Storage**: Only in client memory; lost on server restart.

### Alerts
- Created via REST (`POST /alerts`) or auto-generated every 10s (`generateAlert()`).
- Stored in server memory using a singleton `AlertRepository` and broadcasted with `new-alert`.
- **Storage**: In-memory only; server restart clears alerts.
## Installation

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd chat-app
```

Install dependencies

```bash
  npm install
```

Start the server on production

```bash
  npm run start
```

Start the server on development

```bash
  npm run dev
```


## Authors

- [@JOHN H. PEÑA](https://www.github.com/PR0C3S)


## Running Tests

To run tests, run the following command

```bash
  https://app.getpostman.com/join-team?invite_code=66f6828fe824e20a0c093d19a88b95629998be04a59cc58b3b97e86572ddc8af&target_code=1bb91004fafd59d86f0054e99a3a6de4
```

