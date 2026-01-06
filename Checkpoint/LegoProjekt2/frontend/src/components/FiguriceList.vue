<template>
    <div class="lego-container">
        <h1>LEGO Figurice</h1>

        <div v-if="loading" class="loading">Učitavanje...</div>
        <div v-if="error" class="error">{{ error }}</div>

        <table v-if="legoList.length > 0" class="lego-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Naziv</th>
                    <th>Cijena ($)</th>
                    <th>Akcije</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in legoList" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.naziv }}</td>
                    <td>${{ item.cijena }}</td>
                    <td>
                        <button @click="deleteItem(item.id)" class="btn-delete">
                            Obriši
                        </button>
                    </td>
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

const fetchData = async () => {
    loading.value = true;
    error.value = null;

    try {
        const response = await legoAPI.getAllFigurice();
        legoList.value = response.data;
        console.log('✅ Podaci primljeni:', response.data);
    } catch (err) {
        error.value = `❌ Greška: ${err.message}`;
        console.error('API greška:', err);
    } finally {
        loading.value = false;
    }
};

const deleteItem = async (id) => {
    if (confirm('Sigurno obrisati?')) {
        try {
            await legoAPI.deleteFigurica(id);
            legoList.value = legoList.value.filter(l => l.id !== id);
        } catch (err) {
            error.value = `❌ Greška pri brisanju: ${err.message}`;
        }
    }
};

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
