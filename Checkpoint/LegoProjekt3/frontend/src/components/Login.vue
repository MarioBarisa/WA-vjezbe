<template>
    <div class="login-container">
      <div class="login-card">
        <h2>Prijava</h2>
        <br></br>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Korisničko ime:   </label>
            <input 
              v-model="credentials.username" 
              type="text" 
              required
              placeholder="Unesi korisničko ime"
            />
          </div>
            <br></br>
          <div class="form-group">
            <label>Lozinka:   </label>
            <input 
              v-model="credentials.password" 
              type="password" 
              required
              placeholder="Unesi lozinku"
            />
          </div>
            <br></br>
          <div v-if="errorMessage" class="error">
            {{ errorMessage }}
          </div>
  
          <button type="submit" :disabled="loading">
            {{ loading ? 'Prijava...' : 'Prijavi se' }}
          </button>
          <div v-if="successMessage" class="success">
            {{ successMessage }}
          </div>
          <hr></hr>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { authService } from '../../services/authService';
  
  export default {
    name: 'Login',
    data() {
      return {
        credentials: {
          username: '',
          password: ''
        },
        loading: false,
          errorMessage: '',
        successMessage: ''
      };
    },
    methods: {
      async handleLogin() {
        this.loading = true;
            this.errorMessage = '';
            this.successMessage = '';
  
        try {
          await authService.login(this.credentials);
          this.successMessage = 'Prijava uspješna!';


        } catch (error) {
          this.errorMessage = error.message || 'Neispravno korisničko ime ili lozinka';
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped></style>
  