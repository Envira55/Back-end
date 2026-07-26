// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API helper functions
const api = {
  // Tests
  async getTests() {
    const response = await fetch(`${API_BASE_URL}/tests`);
    return response.json();
  },

  // Reports
  async getPatientReport(patientId, patientName) {
    const response = await fetch(
      `${API_BASE_URL}/reports/patient?patientId=${patientId}&patientName=${patientName}`
    );
    return response.json();
  },

  // Admin
  async adminLogin(accessKey) {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessKey })
    });
    return response.json();
  },

  async createReport(reportData, accessKey) {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': accessKey
      },
      body: JSON.stringify(reportData)
    });
    return response.json();
  },

  async updateTestPrice(testId, price, accessKey) {
    const response = await fetch(`${API_BASE_URL}/tests/${testId}/price`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': accessKey
      },
      body: JSON.stringify({ price })
    });
    return response.json();
  },

  // Chatbot
  async sendChatMessage(message) {
    const response = await fetch(`${API_BASE_URL}/chatbot/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    return response.json();
  }
};