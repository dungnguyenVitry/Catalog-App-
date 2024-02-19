<template>
  <div class="home">
    <h2>Welcome to Catalog App!</h2>
    <p>Manage your apps now by logging in.</p>

    <div class="row">         
      <div class="d-flex flex-column h-100 justify-content-center">
        <div class="login-section">
          <form @submit.prevent="login">
            <div class="mb-3">
              <label for="email" class="form-label">Email:</label>
              <input type="email" class="form-control" id="email" v-model="loginForm.email" required>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password:</label>
              <input type="password" class="form-control" id="password" v-model="loginForm.password" required>
            </div>
            <button type="submit" class="btn">Login</button>
            <!-- Hiển thị thông báo lỗi -->
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          </form>
        </div>                
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from '../axios';

const loginForm = {
  email: '',
  password: ''
};

const errorMessage = ref('');

const login = async () => {
  try {
    const response = await axios.post('http://localhost:3000/login', loginForm);
    const { token } = response.data;
    console.log(token); 
    localStorage.setItem('token', token);
    // Redirect to catalog page
    window.location.href = '/catalog';
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = 'Please check your login information';
  }
};


axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
</script>


<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20%;
}

h2 {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  font-size: 30px;
  color: #333;
  margin-bottom: 10px; 
}

p {
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  color: #666;
  text-align: center;
}

.login-section {
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  align-items:center;
  margin-left:30%;
}   

.btn:hover {
  background-color: #45a049;
  color: white;
}

.error-message {
  color: red;
}
</style>
