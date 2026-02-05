<template>
  <div id="app">
      <header>
          <nav>
            <div v-if="isLoggedIn" class="user-info">
              Korisnik: <strong>{{ user?.username }}</strong>
              <span v-if="user?.role === 'administrator'" class="admin-badge">(Admin)</span>
            </div>

            <button 
                @click="activeView = 'kocke'" 
                :class="{ active: activeView === 'kocke' }"
            >
                Pregled kocka
            </button>
            <button 
                @click="activeView = 'PosebneKocke'" 
                :class="{ active: activeView === 'PosebneKocke' }"
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
                @click="activeView = 'LegoSetovi'" 
                :class="{ active: activeView === 'LegoSetovi' }"
            >
                Pregled setova
            </button>
            <button 
                v-if="user?.role === 'admin'"
                @click="activeView = 'addSet'" 
                :class="{ active: activeView === 'addSet' }"
            >
                Dodaj Set
            </button>

            <template v-if="!isLoggedIn">
              <button 
                  @click="activeView = 'Login'" 
                  :class="{ active: activeView === 'Login' }"
              >
                  Login 
              </button>
              <button 
                  @click="activeView = 'Register'" 
                  :class="{ active: activeView === 'Register' }"
              >
                  Register
              </button>
            </template>
            <button 
                v-if="isLoggedIn"
                @click="handleLogout"
                class="logout-btn"
            >
                Odjava
            </button>
          </nav>
      </header>

      <main>
          <LegoList v-if="activeView === 'Figuricelist'" :key="refreshKey" />
          <LegoForm v-if="activeView === 'addSet'" @submitted="refreshList" />
          <LegoKocke v-if="activeView === 'kocke'" @submitted="refreshList" />
          <PosebneKocke v-if="activeView === 'PosebneKocke'" @submitted="refreshList"/>
          <LegoSetovi v-if="activeView === 'LegoSetovi'" @submitted="refreshList"/>
          <Login v-if="activeView === 'Login'" @login-success="handleLoginSuccess"/>
          <Register v-if="activeView === 'Register'" @submitted="refreshList"/>
      </main>

      <footer>
          <p>Checkpoint 3</p>
      </footer>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import LegoList from './components/FiguriceList.vue';
import LegoForm from './components/AddSet.vue';
import LegoKocke from './components/Kocke.vue';
import PosebneKocke from './components/PosebneKocke.vue';
import LegoSetovi from './components/LegoSetovi.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import { authService } from '../services/authService.js';

const activeView = ref('kocke');
const refreshKey = ref(0);

// Auth state
const isLoggedIn = ref(false);
const user = ref(null);

// Provjeri autentifikaciju
const checkAuth = () => {
  isLoggedIn.value = authService.isLoggedIn();
  user.value = authService.getCurrentUser();
};

// Logout funkcija
const handleLogout = () => {
  authService.logout();
  checkAuth(); // Osvježi state
  activeView.value = 'Login';
};

// Refresh nakon login-a
const handleLoginSuccess = () => {
  checkAuth();
  activeView.value = 'kocke'; // Prebaci na glavnu stranicu
  refreshList();
};

const refreshList = () => {
  refreshKey.value++;
};

// Provjeri auth pri učitavanju
onMounted(() => {
  checkAuth();
});
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
