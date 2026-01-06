<template>
    <div class="form-container">
        <h1>Dodaj Novi LEGO Set</h1>

        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="name">Naziv:</label>
                <input
                    v-model="formData.name"
                    type="text"
                    id="name"
                    placeholder="npr. LEGO City"
                    required
                />
            </div>

            <div class="form-group">
                <label for="pieces">Broj Dijelova:</label>
                <input
                    v-model.number="formData.pieces"
                    type="number"
                    id="pieces"
                    placeholder="npr. 500"
                    required
                />
            </div>

            <div class="form-group">
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

            <div class="form-group">
                <label for="theme">Tema:</label>
                <input
                    v-model="formData.theme"
                    type="text"
                    id="theme"
                    placeholder="npr. City"
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
    name: '',
    pieces: '',
    price: '',
    theme: ''
});

const message = ref('');
const messageClass = ref('');

const submitForm = async () => {
    message.value = '';

    try {
        await legoAPI.createSet(formData.value);
        message.value = '✅ Set uspješno dodan!';
        messageClass.value = 'success';
        
        // Resetiraj formu
        formData.value = {
            name: '',
            pieces: '',
            price: '',
            theme: ''
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
