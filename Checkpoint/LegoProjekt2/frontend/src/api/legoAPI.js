import axios from "axios";

const API_BASE_URL = 'http://localhost:3005';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

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