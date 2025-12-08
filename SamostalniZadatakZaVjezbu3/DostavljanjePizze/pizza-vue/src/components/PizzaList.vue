
<script setup>

import { ref } from 'vue';
import axios from 'axios';
const odabrana_pizza = ref(null); // reaktivna varijabla za pohranu naziva odabrane pizze
function odaberiPizzu(pizza_naziv) {
    odabrana_pizza.value = pizza_naziv; // postavljanje naziva odabrane pizze
    console.log('Odabrana pizza:', odabrana_pizza.value); // ispis u konzolu (provjerite)
}


axios.get('http://localhost:3000/pizze') // slanje GET zahtjeva na /pizze endpoint
    .then(response => {
        console.log(response.data); // ispisuje podatke o pizzama iz odgovora
    })
    // obrada greške
    .catch(error => {
        console.error('Greška pri dohvaćanju podataka o pizzama:', error);
    });

</script>
<style></style>


<template>

    <div class="bg-inherit rounded-xl overflow-hidden">
        <div class="w-full h-48 flex items-center justify-center bg-white">
            <!-- Slika s interneta -->
            <img src="https://www.freeiconspng.com/uploads/pizza-png-1.png" alt="Pizza Image
1" class="w-full h-full object-contain" />
        </div>
        <div class="p-6">
            <div class="flex items-center space-x-3 mb-4">
                <!-- Naziv -->
                <h2 @click="odaberiPizzu('Margherita')" class="text-lg font-bold text-orange-500 tracking-wide">Margherita</h2>
                <!-- Sastojci -->
                <div class="flex space-x-2">
                    <div
                        class="w-8 h-8 bg-orange-500 rounded-full flex items-center justifycenter text-slate-50 font-semibold text-xs">
                        Icon</div>
                    <div
                        class="w-8 h-8 bg-orange-500 rounded-full flex items-center justifycenter text-slate-50 font-semibold text-xs">
                        Icon</div>
                    <div
                        class="w-8 h-8 bg-orange-500 rounded-full flex items-center justifycenter text-slate-50 font-semibold text-xs">
                        Icon</div>
                </div>
            </div>
            <!-- Cijene za svaku veličinu -->
            <div class="space-y-2">
                <div class="flex justify-between text-gray-700">
                    <span class="font-medium">Mala</span>
                    <span>€00.00</span>
                </div>
                <div class="flex justify-between text-gray-700">
                    <span class="font-medium">Srednja</span>
                    <span>€00.00</span>
                </div>
                <div class="flex justify-between text-gray-700">
                    <span class="font-medium">Jumbo</span>
                    <span>€00.00</span>
                </div>
            </div>
        </div>
    </div>

    <div class="bg-inherit rounded-xl overflow-hidden">
        <div class="w-full h-48 flex items-center justify-center bg-white">
            <!-- Slika s interneta -->
            <img src="https://www.freeiconspng.com/uploads/pizza-png-1.png" alt="Pizza Image
1" class="w-full h-full object-contain" />
        </div>
        <div class="p-6">
            <div class="flex items-center space-x-3 mb-4">
                <!-- Naziv -->
                <h2 @click="odaberiPizzu('Capricciosa')" class="text-lg font-bold text-orange-500 tracking-wide">Capricciosa</h2>
                <!-- Sastojci -->
                <div class="flex space-x-2">
                    <div
                        class="w-8 h-8 bg-orange-500 rounded-full flex items-center justifycenter text-slate-50 font-semibold text-xs">
                        Icon</div>
                    <div
                        class="w-8 h-8 bg-orange-500 rounded-full flex items-center justifycenter text-slate-50 font-semibold text-xs">
                        Icon</div>
                    <div
                        class="w-8 h-8 bg-orange-500 rounded-full flex items-center justifycenter text-slate-50 font-semibold text-xs">
                        Icon</div>
                </div>
            </div>
            <!-- Cijene za svaku veličinu -->
            <div class="space-y-2">
                <div class="flex justify-between text-gray-700">
                    <span class="font-medium">Mala</span>
                    <span>€00.00</span>
                </div>
                <div class="flex justify-between text-gray-700">
                    <span class="font-medium">Srednja</span>
                    <span>€00.00</span>
                </div>
                <div class="flex justify-between text-gray-700">
                    <span class="font-medium">Jumbo</span>
                    <span>€00.00</span>
                </div>
            </div>
        </div>
    </div>

</template>