<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    
    const route = useRoute();
    const router = useRouter();
    
    const pizza = ref(null);
    const ucitavanje = ref(true);
    const greska = ref('');
    
    onMounted(async () => {
        await dohvatiPizzu();
    });
    
    async function dohvatiPizzu() {
        ucitavanje.value = true;
        greska.value = '';
        
        try {
            const response = await fetch(`http://localhost:3000/pizze/${route.params.naziv}`);            
            if (!response.ok) {
                throw new Error('Pizza nije pronađena');
            }
            
            const data = await response.json();
            pizza.value = data;
        } catch (error) {
            greska.value = 'Pizza nije pronađena';
        } finally {
            ucitavanje.value = false;
        }
    }
    
    function vratiSeNaPopis() {
        router.push('/');
    }
    </script>
    
    <template>
        <div class="min-h-screen bg-slate-900 p-6">
            <div class="max-w-3xl mx-auto">
                <button
                    @click="vratiSeNaPopis"
                    class="mb-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
                    ← Natrag na popis
                </button>
    
                <div v-if="ucitavanje" class="text-white text-center py-20">
                    Učitavanje...
                </div>
    
                <div v-else-if="greska" class="bg-red-500/20 border border-red-500 text-white p-6 rounded">
                    {{ greska }}
                </div>
    
                <div v-else-if="pizza" class="bg-slate-800 rounded-lg overflow-hidden text-white">
                    <img :src="pizza.slika_url" :alt="pizza.naziv" class="w-full h-64 object-cover" />
                    
                    <div class="p-6">
                        <h1 class="text-3xl font-bold mb-4">{{ pizza.naziv }}</h1>
                        
                        <div class="mb-4">
                            <h2 class="text-xl font-semibold mb-2">Sastojci:</h2>
                            <p class="text-gray-300">{{ pizza.sastojci.join(', ') }}</p>
                        </div>
                        
                        <div>
                            <h2 class="text-xl font-semibold mb-2">Cijene:</h2>
                            <div class="space-y-2">
                                <div class="flex justify-between">
                                    <span>Mala:</span>
                                    <span class="font-bold">{{ pizza.cijene.mala }}€</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Srednja:</span>
                                    <span class="font-bold">{{ pizza.cijene.srednja }}€</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Jumbo:</span>
                                    <span class="font-bold">{{ pizza.cijene.jumbo }}€</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
    