<script setup>

import { ref } from 'vue';
import axios from 'axios';
const odabrana_pizza = ref(null);



axios.get('http://localhost:3005/pizze') //tu treba staviti port
    .then(response => {
        console.log(response.data);
    })

    .catch(error => {
        console.error('Greška pri dohvaćanju podataka o pizzama:', error);
    });

import { onMounted } from 'vue';
const pizze = ref([]); 
onMounted(() => {
    axios
        .get('http://localhost:3005/pizze')
        .then(response => {
            pizze.value = response.data; 
        })
        .catch(error => {
            console.error('Greška pri dohvaćanju podataka o pizzama:', error);
        });
});
console.log(pizze.value);

import {
    GiTomato, GiCheeseWedge, GiSlicedMushroom, IoLeafSharp, CoHotjar, GiMilkCarton,
    GiBellPepper, LaPepperHotSolid, GiCannedFish, GiGarlic, FaBacon, GiHamShank
} from 'ohvue-icons/icons';
import { addIcons } from 'oh-vue-icons';

addIcons(GiTomato, GiCheeseWedge, GiSlicedMushroom, IoLeafSharp, GiBellPepper, GiHamShank,
LaPepperHotSolid, GiCannedFish, GiGarlic, FaBacon, CoHotjar, GiMilkCarton);

const ikoneSastojaka = {
    rajčica: 'gi-tomato',
    sir: 'gi-cheese-wedge',
    gljive: 'gi-sliced-mushroom',
    bosiljak: 'io-leaf-sharp',
    paprika: 'gi-bell-pepper',
    šunka: 'gi-ham-shank',
    'feferoni ljuti': 'la-pepper-hot-solid',
    tunjevina: 'gi-canned-fish',
    'crveni luk': 'gi-garlic',
    panceta: 'fa-bacon',
    kulen: 'co-hotjar',
    vrhnje: 'gi-milk-carton'
};

import OrderFooter from './OrderFooter.vue';

function odaberiPizzu(pizza) {
    odabrana_pizza.value = pizza; // pohranjujemo cijeli objekt pizze
    console.log('Odabrana pizza:', pizza);
}

</script>
<style></style>


<template>

<div v-for="pizza in pizze" @click="odaberiPizzu(pizza)" :key="pizza.id"> 
    <div class="bg-inherit rounded-xl overflow-hidden">
        <div class="w-full h-48 flex items-center justify-center bg-white">
            <!-- Slika s interneta -->
            <img :src="pizza.slika_url" alt="Pizza Image
1" class="w-full h-full object-contain" />
        </div>
        <div class="p-6">
            <div class="flex items-center space-x-3 mb-4">
                <!-- Naziv -->
                <h2 @click="odaberiPizzu(pizza.naziv)" class="text-lg font-bold text-orange-500 tracking-wide">
                    {{ pizza.naziv }}</h2>
                <!-- Sastojci -->
                    <div v-for="sastojak in pizza.sastojci" :key="sastojak"
                        class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate50 font-semibold text-xs">
                        <v-icon :name="ikoneSastojaka[sastojak]" />
                    </div>
                </div>
            <!-- Cijene za svaku veličinu -->
            <div class="space-y-2">
                <div class="flex justify-between text-gray-700">
                    <span class="font-medium">Mala</span>
                    <span>{{pizza.cijene.mala}}</span>
                </div>
                <div class="flex justify-between text-gray-700">
                    <span class="font-medium">Srednja</span>
                    <span>{{pizza.cijene.srednja}}</span>
                </div>
                <div class="flex justify-between text-gray-700">
                    <span class="font-medium">Jumbo</span>
                    <span>{{pizza.cijene.jumbo}}</span>
                </div>
            </div>
        </div>
    </div>
</div>
    
<OrderFooter></OrderFooter>

</template>