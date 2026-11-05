import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

export const marketService = {
  async getProducts() {
    const response = await api.get('/products')
    return response.data
  },
  async getInsights() {
    const response = await api.get('/insights')
    return response.data
  },
}
