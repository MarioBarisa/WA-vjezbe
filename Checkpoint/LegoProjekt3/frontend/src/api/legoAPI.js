import axios from "axios";

const API_BASE_URL = 'http://localhost:3005';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default {
    getAllFigurice() {
        return apiClient.get('/figurice');
    },

    getFiguricaByName(naziv) {
        return apiClient.get(`/figurice/${naziv}`);
    },

    createFigurica(data) {
        return apiClient.post('/figurice', data);
    },

    deleteFigurica(id) {
        return apiClient.delete(`/figurice/${id}`);
    },

    // KOCKE ENDPOINTI
    getAllKocke() {
        return apiClient.get('/legoKocke');
    },

    updateKocka(id, data) {
        return apiClient.put(`/legoKocke/${id}`, data);
    },

    updateKockaNaziv(id, data) {
        return apiClient.patch(`/legoKocke/promjenaNaziva/${id}`, data);
    },

    updateKockaCijena(id, cijenaEUR) {
        return apiClient.patch(`/legoKocke/promjenaEUR/${id}`, cijenaEUR);
    },

    createKocka(data) {
        return apiClient.post('/legoKocke', data);
    },

    legoKockeNaziv(naziv) {
        return apiClient.get(`/legoKockeNaziv/${naziv}`)
    },

    //Posebne Kocke

    getPosebneKocke() {
        return apiClient.get('/legoPosebneKocke');
    },
    getPosebneKockeGT(cijena) {
        return apiClient.get(`/legoPosebneKocke/${cijena}`)
    },
    getPosebneKockeLT(cijena) {
        return apiClient.get(`/legoPosebneKockeLT/${cijena}`)
    },

    // LEGO SETOVI ENDPOINTI
    getAllSetovi() {
        return apiClient.get('/legoSetovi');
    },

    createSet(data) {
        return apiClient.post('/legoSetovi', data);
    },

    deleteSet(id) {
        return apiClient.delete(`/legoSetovi/${id}`);
    }
}