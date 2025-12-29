<script setup>
    import { ref } from 'vue';
    import axios from 'axios';
    
    const props = defineProps({
        odabranaPizza: {
            type: Object,
            required: true
        }
    });
    
    const emit = defineEmits(['order-placed']);
    
    let narucene_pizze = ref([]);
    let odabranaVelicina = ref('');
    let brojPizza = ref(1);
    
    const ime = ref('');
    const adresa = ref('');
    const telefon = ref('');
    const greska = ref('');
    const statusNarudzbe = ref(null); 
    const statusPoruka = ref('');
    const isSubmitting = ref(false);
    
    function dodajUNarudzbu() {
        if (!odabranaVelicina.value) {
            greska.value = 'Molimo odaberite veličinu pizze.';
            return;
        }
        
        const novaStavka = {
            naziv: props.odabranaPizza.naziv,
            velicina: odabranaVelicina.value,
            kolicina: brojPizza.value,
            cijena: props.odabranaPizza.cijene[odabranaVelicina.value]
        };
        
        narucene_pizze.value.push(novaStavka);
        greska.value = '';
        brojPizza.value = 1;
        odabranaVelicina.value = '';
        
        console.log('Naručene pizze:', narucene_pizze.value);
    }
    
    function obrisiStavku(index) {
        narucene_pizze.value.splice(index, 1);
        console.log('Stavka obrisana. Preostale pizze:', narucene_pizze.value);
    }
    
    function isprazniKosaricu() {
        narucene_pizze.value = [];
        greska.value = '';
        statusNarudzbe.value = null;
        console.log('Košarica ispražnjena');
    }
    
    async function posaljiNarudzbu() {
        if (narucene_pizze.value.length === 0) {
            greska.value = 'Košarica je prazna. Dodajte pizze';
            return;
        }
        
        // broj telefona -> samo brojevi
        if (!/^\d+$/.test(telefon.value)) {
            greska.value = 'Telefon mora sadržavati samo brojeve!';
            return;
        }
    
        greska.value = '';
        statusNarudzbe.value = 'loading';
        statusPoruka.value = 'Slanje narudžbe u tijeku...';
        isSubmitting.value = true;
        
        // priprema prije slanja
        const narudzba = {
            ime: ime.value,
            adresa: adresa.value,
            telefon: telefon.value,
            narucene_pizze: narucene_pizze.value.map(pizza => ({
                naziv: pizza.naziv,
                velicina: pizza.velicina,
                kolicina: pizza.kolicina
            }))
        };
        
        try {
            const response = await axios.post(
                'http://localhost:3005/narudzba',
                narudzba
            );
            
            statusNarudzbe.value = 'success';
            statusPoruka.value = `Narudžba uspješna! Ukupna cijena: €${response.data.ukupna_cijena}`;
            
            // brise nakon 3 sekunde?
            setTimeout(() => {
                narucene_pizze.value = [];
                ime.value = '';
                adresa.value = '';
                telefon.value = '';
                statusNarudzbe.value = null;
                emit('order-placed');
            }, 3000);
        } catch (error) {
            statusNarudzbe.value = 'error';
            statusPoruka.value = error.response?.data?.error || 'Greška pri slanju narudžbe';
            console.error('Greška pri narudžbi:', error);
        } finally {
            isSubmitting.value = false;
        }
    }
    </script>
    
    <template>
        <footer class="fixed bottom-0 left-0 right-0 bg-slate-700/95 backdrop-blur-sm border-t border-slate-600 shadow-xl p-4 text-white max-h-[80vh] overflow-y-auto">
            <div class="max-w-7xl mx-auto space-y-4">
                
                <!-- obavjesti kupca -->
                <div 
                    v-if="statusNarudzbe"
                    :class="[
                        'p-4 rounded-lg border-2 transition-all duration-300',
                        statusNarudzbe === 'loading' && 'bg-blue-900/30 border-blue-500 text-blue-200',
                        statusNarudzbe === 'success' && 'bg-green-900/30 border-green-500 text-green-200',
                        statusNarudzbe === 'error' && 'bg-red-900/30 border-red-500 text-red-200'
                    ]"
                >
                    <div class="flex items-center gap-3">
                        <span class="font-semibold">{{ statusPoruka }}</span>
                    </div>
                </div>
                
                <!-- sekcija pize -->
                <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-600">
                    <div class="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-2">
                        <img 
                            :src="props.odabranaPizza.slika_url" 
                            alt="Pizza slika"
                            class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shadow-md shadow-black/40" 
                        />
                        <h3 class="font-bold tracking-wide text-base sm:text-lg text-orange-400">
                            {{ props.odabranaPizza.naziv }}
                        </h3>
                    </div>
                    
                    <div class="flex items-center justify-center flex-wrap gap-2">
                        <button 
                            v-for="(cijena, velicina) in odabranaPizza.cijene" 
                            :key="velicina"
                            :class="[
                                'px-3 py-1 cursor-pointer rounded-lg border transition-all text-sm sm:text-base',
                                odabranaVelicina === velicina 
                                    ? 'bg-orange-500 border-orange-400 text-white' 
                                    : 'border-slate-500 bg-slate-600/40 hover:bg-orange-500 hover:border-orange-400 hover:text-white'
                            ]"
                            @click="odabranaVelicina = velicina">
                            {{ velicina }} – {{ cijena }}€
                        </button>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                        <button
                            class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all cursor-pointer disabled:opacity-50"
                            :disabled="brojPizza <= 1"
                            @click="brojPizza--">
                            -
                        </button>
                        <div class="px-3 py-1 bg-slate-600/40 backdrop-blur-sm rounded-md border border-slate-500 text-sm sm:text-base min-w-[50px] text-center">
                            {{ brojPizza }}
                        </div>
                        <button
                            class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all cursor-pointer"
                            @click="brojPizza++">
                            +
                        </button>
                    </div>
                    
                    <button 
                        @click="dodajUNarudzbu" 
                        class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-black/40 hover:bg-orange-600 transition-all tracking-wide cursor-pointer w-full sm:w-auto text-center">
                        Dodaj u košaricu
                    </button>
                </div>
    
                <!-- orderane pizze -->
                <div v-if="narucene_pizze.length > 0" class="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="font-bold text-lg">Vaša košarica:</h4>
                    </div>
                    <div class="space-y-2">
                        <div 
                            v-for="(pizza, index) in narucene_pizze" 
                            :key="index"
                            class="flex justify-between items-center py-2 px-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors group">
                            <div class="flex-1">
                                <span class="font-medium">{{ pizza.naziv }}</span>
                                <span class="text-gray-400 text-sm ml-2">({{ pizza.velicina }})</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="text-gray-300">x{{ pizza.kolicina }}</span>
                                <span class="font-bold text-orange-400 min-w-[60px] text-right">
                                    {{ (pizza.cijena * pizza.kolicina).toFixed(2) }}€
                                </span>
                                <button 
                                    @click="obrisiStavku(index)"
                                    class="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                    x
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="mt-3 pt-3 border-t border-slate-600 flex justify-between items-center font-bold text-lg">
                        <span>Ukupno:</span>
                        <span class="text-orange-400">
                            {{ narucene_pizze.reduce((sum, p) => sum + (p.cijena * p.kolicina), 0).toFixed(2) }}€
                        </span>
                    </div>
                </div>
    
                <div class="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
                    <h4 class="font-bold text-lg mb-3">Podaci za dostavu:</h4>
                    <form @submit.prevent="posaljiNarudzbu" class="space-y-3">
                        <div>
                            <label for="prezime" class="block text-sm font-medium text-gray-300 mb-1">
                                Prezime -> OBAVEZNO
                            </label>
                            <input
                                id="prezime"
                                v-model="prezime"
                                type="text"
                                class="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                placeholder="Unesite prezime"
                                :disabled="statusNarudzbe === 'loading'"
                            />
                        </div>
                        
                        <div>
                            <label for="adresa" class="block text-sm font-medium text-gray-300 mb-1">
                                Adresa -> OBAVEZNO
                            </label>
                            <input
                                id="adresa"
                                v-model="adresa"
                                type="text"
                                class="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                placeholder="Unesite adresu"
                                :disabled="statusNarudzbe === 'loading'"
                            />
                        </div>
                        
                        <div>
                            <label for="telefon" class="block text-sm font-medium text-gray-300 mb-1">
                                Telefon -> OBAVEZNO
                            </label>
                            <input
                                id="telefon"
                                v-model="telefon"
                                type="tel"
                                class="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                placeholder="Unesite broj telefona"
                                :disabled="statusNarudzbe === 'loading'"
                            />
                        </div>
                        
                        <div v-if="greska" class="text-red-400 text-sm bg-red-900/20 px-3 py-2 rounded-lg border border-red-500/30">
                            {{ greska }}
                        </div>
                        
                        <button 
                            type="submit"
                            :disabled="statusNarudzbe === 'loading'"
                            class="w-full bg-green-600 text-white font-semibold px-4 py-3 rounded-xl shadow-md shadow-black/40 hover:bg-green-700 transition-all tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ statusNarudzbe === 'loading' ? 'Šaljem...' : 'Potvrdi narudžbu' }}
                        </button>
                    </form>
                </div>
            </div>
        </footer>
    </template>
    