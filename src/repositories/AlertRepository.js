export class AlertRepository {
  constructor() {
    if (!AlertRepository.instance) {
      this.allAlertsData = [];
      AlertRepository.instance = this;
    }
    return AlertRepository.instance;
  }

  getAll() {
    return [...this.allAlertsData];
  }

  getTop10() {
    return this.allAlertsData.slice(-10);
  }

  findById(id) {
    return this.allAlertsData.find((alert) => alert.id === id) || null;
  }

  create(data) {
    if (!data) {
      throw new Error("Invalid data");
    }

    this.allAlertsData.push(data);

    return data;
  }

  delete(id) {
    const index = this.allAlertsData.findIndex((alert) => alert.id === id);
    if (index === -1) {
      throw new Error("Alert not found");
    }

    this.allAlertsData.splice(index, 1);
  }
}

// Exportar la instancia singleton
export const AlertRepositoryInstance = new AlertRepository();
