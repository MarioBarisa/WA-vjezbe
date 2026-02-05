<template>
    <div class="form-container">
        <h1>Dodaj Novi LEGO Set</h1>

        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="name">Naziv:</label>
                <input
                    v-model="formData.naziv"
                    type="text"
                    id="name"
                    placeholder="npr. LEGO City"
                    required
                />
            </div>

            <div class="form-group">
                <label for="pieces">Kocka (ID)</label>
                <input
                    v-model.number="formData.kocka"
                    type="number"
                    id="pieces"
                    required
                />
            </div>

            <div class="form-group">
                <label for="price">Figurica (ID)</label>
                <input
                    v-model.number="formData.figurica"
                    type="number"
                    id="price"
                    step="0.01"
                    required
                />
            </div>

            <div class="form-group">
                <label for="theme">Posebna kocka (ID)</label>
                <input
                    v-model="formData.posebnaKocka"
                    type="text"
                    id="theme"
                />
            </div>

            <button type="submit" class="btn-submit">Dodaj Set</button>
            <span v-if="message" :class="messageClass">{{ message }}</span>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import legoAPI from '../api/legoAPI';

const formData = ref({
    naziv: '',
    kocka: '',
    figurica: '',
    posebnaKocka: ''
});

const message = ref('');
const messageClass = ref('');

const submitForm = async () => {
    message.value = '';

    try {
        await legoAPI.createSet(formData.value);
        message.value = 'Set uspješno dodan!';
        messageClass.value = 'success';
        
        // Resetiraj formu
        formData.value = {
            name: '',
            kocka: '',
            figurica: '',
            posebnaKocka: ''
        };

        // Ukloni poruku nakon 3 sekunde
        setTimeout(() => {
            message.value = '';
        }, 3000);
    } catch (err) {
        message.value = `❌ Greška: ${err.message}`;
        messageClass.value = 'error';
    }
};
</script>

<style scoped>
.form-container {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #f9f9f9;
}

h2 {
    text-align: center;
    color: #333;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
}

</style>
