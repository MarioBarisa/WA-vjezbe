<template>
  <div id="app">
      <header>
          <nav>
            <button 
                  @click="activeView = 'kocke'" 
                  :class="{ active: activeView === 'kocke' }"
              >
                  Pregled kocka
              </button>
              <button 
                  @click="activeView = 'add'" 
                  :class="{ active: activeView === 'add' }"
              >
                  Pregled posebnih kocka
              </button>
              <button 
                  @click="activeView = 'Figuricelist'" 
                  :class="{ active: activeView === 'Figuricelist' }"
              >
                  Pregled Figurica
              </button>
              <button 
                  @click="activeView = 'addSet'" 
                  :class="{ active: activeView === 'addSet' }"
              >
                  Pregled setova
              </button>
              <button 
                  @click="activeView = 'addSet'" 
                  :class="{ active: activeView === 'addSet' }"
              >
                  Dodaj Set
              </button>
          </nav>
      </header>

      <main>
          <LegoList v-if="activeView === 'Figuricelist'" :key="refreshKey" />
          <LegoForm v-if="activeView === 'addSet'" @submitted="refreshList" />
          <LegoKocke v-if="activeView === 'kocke'" @submitted="refreshList" />
      </main>

      <footer>
          <p>Checkpoint 2</p>
      </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LegoList from './components/FiguriceList.vue';
import LegoForm from './components/AddSet.vue';
import LegoKocke from './components/Kocke.vue';

const activeView = ref('list');
const refreshKey = ref(0);

const refreshList = () => {
  refreshKey.value++;
};
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background:  #0066cc;
  color: white;
  padding: 20px;
  text-align: center;
}
footer {
  background:  #0066cc;
  color: white;
  padding: 5px;
  text-align: center;
}

header h1 {
  margin: 0 0 20px 0;
}

nav {
  display: flex;
  gap: 10px;
  justify-content: center;
}

nav button {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.3s;
}

</style>
