

<template>
  <div class="app">
    <h1>Catalog App</h1>
  </div>
 <router-view />
</template>

<script setup>
</script>

<style scoped>
  .app {
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #4b6cb7, #182848);  
    padding: 20px;
    margin-bottom: 20px;
  }
  h1 {  
  
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  font-size: 36px;
  color: #fff;  
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  


  @media screen and (max-width: 768px) {
 
  .catalog-app {
      padding: 20px; /* Tạo khoảng cách cho giao diện trên iPad Mini */
  }
  }

</style>
