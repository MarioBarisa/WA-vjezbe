<script setup>
    import { ref } from 'vue';
    import axios from 'axios';
    import { onMounted } from 'vue';
    import { addIcons } from 'oh-vue-icons';
    import { GiTomato, GiCheeseWedge, GiSlicedMushroom, IoLeafSharp, CoHotjar, GiMilkCarton, GiBellPepper, LaPepperHotSolid, GiCannedFish, GiGarlic, FaBacon, GiHamShank } from 'oh-vue-icons/icons';
    import OrderFooter from './OrderFooter.vue';
    
    addIcons(GiTomato, GiCheeseWedge, GiSlicedMushroom, IoLeafSharp, GiBellPepper, GiHamShank, LaPepperHotSolid, GiCannedFish, GiGarlic, FaBacon, CoHotjar, GiMilkCarton);
    
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
    
    const pizze = ref([]);
    const odabrana_pizza = ref(null);
    
    // filtriranje i sortiranje
    const filtarNaziv = ref('');
    const filtarCijenaMin = ref('');
    const filtarCijenaMax = ref('');
    const filtarSort = ref('');
    const isLoading = ref(false);
    
    async function fetchPizze() {
        isLoading.value = true;
        try {
            const params = new URLSearchParams();
            
            if (filtarNaziv.value.trim()) {
                params.append('naziv', filtarNaziv.value);
            }
            if (filtarCijenaMin.value) {
                params.append('cijena_min', filtarCijenaMin.value);
            }
            if (filtarCijenaMax.value) {
                params.append('cijena_max', filtarCijenaMax.value);
            }
            if (filtarSort.value) {
                params.append('sort', filtarSort.value);
            }
    
            const response = await axios.get(
                `http://localhost:3005/pizze?${params.toString()}`
            );
            
            pizze.value = response.data;
            console.log('Pizze učitane:', pizze.value);
        } catch (error) {
            console.log('Greška pri dohvaćanju pizza:', error);
        } finally {
            isLoading.value = false;
        }
    }
    
    function odaberiPizzu(pizza) {
        odabrana_pizza.value = pizza;
        console.log('Odabrana pizza:', pizza);
    }
    
    onMounted(() => {
        fetchPizze();
    });
    </script>

<template>
    <div class="mx-auto bg-linear-to-br min-h-screen p-8 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">
        <div class="bg-white/90 rounded-lg p-6 mb-8 shadow-lg max-w-2xl mx-auto">
            <h2 class="text-2xl font-bold text-orange-600 mb-4">Filtri i pretraživanje</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Pretraži po nazivu:</label>
                    <input 
                        v-model="filtarNaziv"
                        @input="fetchPizze"
                        type="text" 
                        placeholder="npr. Margarita"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Sortiraj po cijeni:</label>
                    <select 
                        v-model="filtarSort"
                        @change="fetchPizze"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="">Bez sortiranja</option>
                        <option value="asc">Od najjeftinije</option>
                        <option value="desc">Od najskupnije</option>
                    </select>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Minimalna cijena (€):</label>
                    <input 
                        v-model="filtarCijenaMin"
                        @input="fetchPizze"
                        type="number" 
                        placeholder="0"
                        min="0"
                        step="0.5"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Maksimalna cijena (€):</label>
                    <input 
                        v-model="filtarCijenaMax"
                        @input="fetchPizze"
                        type="number" 
                        placeholder="50"
                        min="0"
                        step="0.5"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                </div>
            </div>
        </div>
        <div v-if="!isLoading && pizze.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
                v-for="pizza in pizze"
                :key="pizza._id"
                @click="odaberiPizzu(pizza)"
                :class="[
                    'bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
                    odabrana_pizza?._id === pizza?._id
                        ? 'ring-4 ring-orange-300 shadow-lg shadow-orange-300/50 scale-[1.02]'
                        : 'hover:scale-[1.01]',
                ]"
            >
                <div class="w-full h-48 flex items-center justify-center bg-inherit overflow-hidden rounded-xl">
                    <img :src="pizza.slika_url" :alt="pizza.naziv" class="w-full h-full object-cover" />
                </div>

                <div class="p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <h2 class="text-lg font-bold text-orange-500 tracking-wide">{{ pizza.naziv }}</h2>

                        <div class="flex space-x-2">
                            <div 
                                v-for="sastojak in pizza.sastojci" 
                                :key="sastojak" 
                                class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">
                                <v-icon :name="ikoneSastojaka[sastojak]" />
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <div class="flex justify-between text-gray-700">
                            <span class="font-medium">Mala</span>
                            <span>€{{ pizza.cijene.mala }}</span>
                        </div>
                        <div class="flex justify-between text-gray-700">
                            <span class="font-medium">Srednja</span>
                            <span>€{{ pizza.cijene.srednja }}</span>
                        </div>

                        <div class="flex justify-between text-gray-700">
                            <span class="font-medium">Jumbo</span>
                            <span>€{{ pizza.cijene.jumbo }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!isLoading && pizze.length === 0" class="text-center text-gray-600 text-lg mt-8">
            <p>Nema pizza koje odgovaraju filtri...</p>
        </div>
        <OrderFooter v-if="odabrana_pizza" :odabranaPizza="odabrana_pizza" @order-placed="fetchPizze" />
    </div>
</template>
