import axios from 'axios';

const service = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

//interceptamos la salida de la llamada y la agregamos el token
service.interceptors.request.use(config => {
  const storedToken = localStorage.getItem('authToken');

  if (storedToken) {
    config.headers = { Authorization: `Bearer ${storedToken}` };
  }

  return config;
});

export default service;
