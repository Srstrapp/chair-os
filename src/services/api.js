// API Service - Conexión con el backend

const API_BASE = '/api/v1';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Error en la solicitud');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Barbershops
  async getBarbershops() {
    return this.request('/barbershops');
  }

  async getBarbershop(id) {
    return this.request(`/barbershops/${id}`);
  }

  async updateBarbershop(id, data) {
    return this.request(`/barbershops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Barbers
  async getBarbers(shopId) {
    return this.request(`/barbershops/${shopId}/barbers`);
  }

  async getBarber(id) {
    return this.request(`/barbers/${id}`);
  }

  async createBarber(data) {
    return this.request('/barbers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBarberWallet(barberId) {
    return this.request(`/barbers/${barberId}/wallet`);
  }

  async getBarberWalletLogs(barberId) {
    return this.request(`/barbers/${barberId}/wallet/logs`);
  }

  // Services
  async getServices(shopId, filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/barbershops/${shopId}/services?${params}`);
  }

  async createService(shopId, data) {
    return this.request(`/barbershops/${shopId}/services`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Cash Box
  async getCashBoxes(shopId) {
    return this.request(`/barbershops/${shopId}/cash-boxes`);
  }

  async openCashBox(shopId) {
    return this.request(`/barbershops/${shopId}/cash-boxes`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  async updateCashBox(shopId, boxId, data) {
    return this.request(`/barbershops/${shopId}/cash-boxes/${boxId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async closeCashBox(shopId, boxId) {
    return this.request(`/barbershops/${shopId}/cash-boxes/${boxId}/close`, {
      method: 'PUT',
    });
  }

  // Inventory
  async getInventory(shopId) {
    return this.request(`/barbershops/${shopId}/inventory`);
  }

  async createInventoryItem(shopId, data) {
    return this.request(`/barbershops/${shopId}/inventory`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async useInventoryItem(itemId, data) {
    return this.request(`/inventory/${itemId}/use`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Customers
  async getCustomers(shopId, search = '') {
    const params = new URLSearchParams({ search });
    return this.request(`/barbershops/${shopId}/customers?${params}`);
  }

  async createCustomer(shopId, data) {
    return this.request(`/barbershops/${shopId}/customers`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Dashboard
  async getDashboard(shopId) {
    return this.request(`/barbershops/${shopId}/dashboard`);
  }

  async getOwnerDashboard() {
    return this.request('/dashboard/owner');
  }

  // BCV Rate
  async getBcvRate(shopId) {
    return this.request(`/barbershops/${shopId}/bcv-rate`);
  }

  async updateBcvRate(shopId, rate) {
    return this.request(`/barbershops/${shopId}/bcv-rate`, {
      method: 'PUT',
      body: JSON.stringify({ rate }),
    });
  }

  // Appointments
  async getAppointments(shopId, date) {
    const params = new URLSearchParams({ date });
    return this.request(`/barbershops/${shopId}/appointments?${params}`);
  }

  async getAvailableSlots(shopId, date, barberId) {
    const params = new URLSearchParams({ date, ...(barberId && { barber_id: barberId }) });
    return this.request(`/barbershops/${shopId}/appointments/available-slots?${params}`);
  }
}

export const api = new ApiService();
export default api;
