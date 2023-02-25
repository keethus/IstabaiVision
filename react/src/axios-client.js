import axios from 'axios';

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  config.headers.Authorization = `Bearer ${token}`;

  return config;
})

axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  const {response} = error;
  try {
    if (response.status === 401) {
      localStorage.removeItem('ACCESS_TOKEN');

    }
  } catch(e) {
    console.log(e);
  }


  throw error;
})


export default axiosClient;
