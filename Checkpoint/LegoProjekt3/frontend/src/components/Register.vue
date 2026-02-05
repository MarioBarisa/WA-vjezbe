<template>
    <div class="register-container ">
      <div class="register-card">
        <h2>Registracija</h2>
        <br></br>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>Korisničko ime:  </label>
            <input 
              v-model="formData.username" 
              type="text" 
              required
              placeholder="Unesi korisničko ime"
            />
          </div>
          <br></br>
          <div class="form-group">
            <label>Email:  </label>
            <input 
              v-model="formData.email" 
              type="email" 
              required
              placeholder="Unesi email"
            />
          </div>
          <br></br>
          <div class="form-group">
            <label>Lozinka:  </label>
            <input 
              v-model="formData.password" 
              type="password" 
              required
              minlength="6"
              placeholder="Min. 6 znakova"
            />
          </div>
  
          <div v-if="errorMessage" class="error">
            {{ errorMessage }}
          </div>
  
          <div v-if="successMessage" class="success">
            {{ successMessage }}
          </div>
          <br></br>
          <button type="submit" :disabled="loading">
            {{ loading ? 'Registracija...' : 'Registriraj se' }}
          </button>
          <hr>
          
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { authService } from '../../services/authService';
  
  export default {
    name: 'Register',
    data() {
      return {
        formData: {
          username: '',
          email: '',
          password: ''
        },
        loading: false,
        errorMessage: '',
        successMessage: ''
      };
    },
    methods: {
      async handleRegister() {
        this.loading = true;
        this.errorMessage = '';
        this.successMessage = '';
  
        try {
          await authService.register(this.formData);
          this.successMessage = 'Registracija uspješna!';
          
          // redirect na login
          setTimeout(() => {
            this.$router.push('/login');
          }, 1000);
  
        } catch (error) {
          this.errorMessage = error.message || 'Greška pri registraciji';
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
<style scoped>

</style>
  