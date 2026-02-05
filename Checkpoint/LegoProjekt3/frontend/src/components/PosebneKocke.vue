<template>
    <div class="lego-container">
        <h1>Posebne LEGO Kocke</h1>

        <div v-if="loading" class="loading">Učitavanje...</div>
        <div v-if="error" class="error">{{ error }}</div>
        <div>
            <p>Unesite MIN cijenu:</p>
            <input
            type="number"
            v-model="filterCijena"
            placeholder="Unesite MIN cijenu"            />
        <button @click="fetchFilteredData">Filtriraj</button>
        </div>
        <div>
            <p>Unesite MAX cijenu:</p>
            <input
            type="number"
            v-model="filterCijenaLT"
            placeholder="Unesite MAX cijenu"            />
        <button @click="fetchFilteredDataLT">Filtriraj</button>
        </div>

        <table v-if="legoList.length > 0" class="lego-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Naziv</th>
                    <th>Cijena ($)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in legoList" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.naziv }}</td>
                    <td>${{ item.cijena }}</td>
                </tr>
            </tbody>
        </table>

        <p v-else class="no-data">Nema dostupnih stavki</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import legoAPI from '../api/legoAPI';

const legoList = ref([]);
const loading = ref(false);
const error = ref(null);
const filterCijena = ref(0);
const filterCijenaLT = ref(0);


const fetchData = async () => {
    loading.value = true;
    error.value = null;

    try {
        const response = await legoAPI.getPosebneKocke();
        legoList.value = response.data;
        console.log('✅ Podaci primljeni:', response.data);
    } catch (err) {
        error.value = `❌ Greška: ${err.message}`;
        console.error('API greška:', err);
    } finally {
        loading.value = false;
    }
};


const fetchFilteredData = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await legoAPI.getPosebneKockeGT(filterCijena.value);
        legoList.value = response.data;
        console.log('✅ Podaci primljeni:', response.data);
    } catch (err) {
        error.value = `❌ Greška: ${err.message}`;
        console.error('API greška:', err);
    } finally {
        loading.value = false;
    }
};


const fetchFilteredDataLT = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await legoAPI.getPosebneKockeLT(filterCijenaLT.value);
        legoList.value = response.data;
        console.log('✅ Podaci primljeni:', response.data);
    } catch (err) {
        error.value = `❌ Greška: ${err.message}`;
        console.error('API greška:', err);
    } finally {
        loading.value = false;
    }
};



/////////////////////////

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
.lego-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

h1 {
    text-align: center;
    color: #333;
}

.loading, .error, .no-data {
    text-align: center;
    padding: 20px;
    font-size: 18px;
}

.error {
    color: red;
    background: #ffe6e6;
    border-radius: 5px;
}

.loading {
    color: #0066cc;
}

.lego-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.lego-table th {
    background: #0066cc;
    color: white;
    padding: 12px;
    text-align: left;
}

.lego-table td {
    border-bottom: 1px solid #ddd;
    padding: 12px;
}

.lego-table tr:hover {
    background: #f5f5f5;
}

.btn-delete {
    background: #ff4444;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-delete:hover {
    background: #cc0000;
}
</style>
