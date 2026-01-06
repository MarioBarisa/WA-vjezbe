<template>
    <div class="lego-container">
        <h1>LEGO Kocke</h1>

        <div v-if="loading" class="loading">Učitavanje...</div>
        <div v-if="error" class="error">{{ error }}</div>

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
        <div class="form-container">
        <h3>Dodaj nove kocke</h3>

        <form class="p-2 m-2" @submit.prevent="submitForm">
            <div class="form-group" style="margin-bottom: 15px;">
                <label for="name">Naziv:</label>
                <input
                    v-model="formData.name"
                    type="text"
                    id="name"
                    placeholder="npr. LEGO City"
                    required
                />
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label for="price">Cijena ($):</label>
                <input
                    v-model.number="formData.price"
                    type="number"
                    id="price"
                    placeholder="npr. 49.99"
                    step="0.01"
                    required
                />
            </div>

            <button type="submit" class="btn-submit">Dodaj Kocku</button>
            <span v-if="message" :class="messageClass">{{ message }}</span>
        </form>

        <h3>Ažuriraj kocku</h3>

<form class="p-2 m-2" @submit.prevent="submitFormUPDATE">
    <div class="form-group" style="margin-bottom: 15px;">
        <label for="name">ID:</label>
        <input
            v-model="formDataUPDATE.id"
            type="text"
            id="name"
            placeholder="npr. LEGO City"
            required
        />
    </div>
    <div class="form-group" style="margin-bottom: 15px;">
        <label for="name">Naziv:</label>
        <input
            v-model="formDataUPDATE.name"
            type="text"
            id="name"
            placeholder="npr. LEGO City"
            required
        />
    </div>

    <div class="form-group" style="margin-bottom: 15px;">
        <label for="price">Cijena ($):</label>
        <input
            v-model.number="formDataUPDATE.price"
            type="number"
            id="price"
            placeholder="npr. 49.99"
            step="0.01"
            required
        />
    </div>

    <button type="submit" class="btn-submit">Ažuriraj Kocku</button>
    <span v-if="message" :class="messageClass">{{ message }}</span>
</form>

    <h3>Ažuriraj naziv kocke</h3>
<form class="p-2 m-2" @submit.prevent="submitFormUPDATE">
    <div class="form-group" style="margin-bottom: 15px;">
        <label for="name">ID:</label>
        <input
            v-model="formDataUPDATE.id"
            type="text"
            id="name"
            placeholder="npr. LEGO City"
            required
        />
    </div>
    <div class="form-group" style="margin-bottom: 15px;">
        <label for="name">Naziv:</label>
        <input
            v-model="formDataUPDATE.name"
            type="text"
            id="name"
            placeholder="npr. LEGO City"
            required
        />
    </div>

    <button type="submit" class="btn-submit">Ažuriraj naziv kocke</button>
    <span v-if="message" :class="messageClass">{{ message }}</span>
</form>

<h3>Ažuriraj cijenu kocke</h3>
<form class="p-2 m-2" @submit.prevent="submitFormCIJENA">
    <div class="form-group" style="margin-bottom: 15px;">
        <label for="name">ID:</label>
        <input
            v-model="formDataUPDATE.id"
            type="text"
            id="name"
            placeholder="npr. LEGO City"
            required
        />
    </div>
    <div class="form-group" style="margin-bottom: 15px;">
        <label for="name">Cijena:</label>
        <input
            v-model="formDataUPDATE.name"
            type="number"
            id="name"
            placeholder="npr. LEGO City"
            required
        />
    </div>

    <button type="submit" class="btn-submit">Ažuriraj cijeu kocke</button>
    <span v-if="message" :class="messageClass">{{ message }}</span>
</form>

    </div>
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
        const response = await legoAPI.getAllKocke();
        legoList.value = response.data;
        console.log('✅ Podaci primljeni:', response.data);
    } catch (err) {
        error.value = `❌ Greška: ${err.message}`;
        console.error('API greška:', err);
    } finally {
        loading.value = false;
    }
};


//  DODAVANJE KOCKE


const formData = ref({
    name: '',
    price: ''
});

const message = ref('');
const messageClass = ref('');

const submitForm = async () => {
    message.value = '';

    try {

        const dataToSend = {
            naziv: formData.value.name,
            cijena: formData.value.price
        };

        await legoAPI.createKocka(dataToSend);
        message.value = 'Kocka uspješno dodana!';
        messageClass.value = 'success';
        
        // Resetiraj formu
        formData.value = {
            name: '',
            price: ''
        };

        // Ukloni poruku nakon 3 sekunde
        setTimeout(() => {
            message.value = '';
        }, 3000);
    } catch (err) {
        message.value = `Greška: ${err.message}`;
        messageClass.value = 'error';
    }
};

//Ažuriranje kocke

const formDataUPDATE = ref({
    id: '',
    name: '',
    price: ''
}); 

const messageUPDATE = ref('');
const messageClassUPDATE = ref('');

const submitFormUPDATE = async () => {
    message.value = '';

    try {
        const dataToSend = {
            naziv: formDataUPDATE.value.name,
            cijena: formDataUPDATE.value.price
        };

        await legoAPI.updateKocka(formDataUPDATE.value.id, dataToSend);
        message.value = 'Kocka uspješno ažurirana!';
        messageClass.value = 'success';
        
        formDataUPDATE.value = {
            id: '',
            name: '',
            price: ''
        };

        setTimeout(() => {
            message.value = '';
        }, 3000);

        // refresh listu kocki
        fetchData();
    } catch (err) {
        message.value = `Greška: ${err.message}`;
        messageClass.value = 'error';
    }
};

//AŽURIRAJ NAZIV KOCKE

const formDataNAZIV = ref({
    id: '',
    name: '',
    
}); 

const messageNAZIV = ref('');
const messageClassNAZIV = ref('');

const submitFormNAZIV = async () => {
    message.value = '';

    try {
        const dataToSend = {
            naziv: formDataNAZIV.value.name,
        };

        await legoAPI.updateKocka(formDataNAZIV.value.id, dataToSend);
        message.value = 'Kocka uspješno ažurirana!';
        messageClass.value = 'success';
        
        formDataNAZIV.value = {
            id: '',
            name: ''
        };

        setTimeout(() => {
            message.value = '';
        }, 3000);

        // refresh listu kocki
        fetchData();
    } catch (err) {
        message.value = `Greška: ${err.message}`;
        messageClass.value = 'error';
    }
};


//Ažuriraj cijenu kocke
const formDataCIJENA = ref({
    id: '',
    cijena: ''
    
}); 

const messageCIJENA = ref('');
const messageClassCIJENA = ref('');

const submitFormCIJENA = async () => {
    messageCIJENA.value = '';

    try {
        const cijenaEUR = formDataCIJENA.value.cijena;
        

        await legoAPI.updateKockaCijena(formDataCIJENA.value.id, { cijenaEUR });
        messageCIJENA.value = 'Cijena uspješno ažurirana!';
        messageClassCIJENA.value = 'success';

        formDataCIJENA.value = {
            id: '',
            cijena: ''
        };

        setTimeout(() => {
            messageCIJENA.value = '';
        }, 3000);

        // Osvježi listu kocki
        fetchData();
    } catch (err) {
        messageCIJENA.value = `Greška: ${err.message}`;
        messageClassCIJENA.value = 'error';
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
