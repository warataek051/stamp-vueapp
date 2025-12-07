<template>
  <div class="show-container">
    <div class="show-content">
      <h1 class="show-title">Results</h1>
      <p class="show-description">Your calculation results will be displayed here.</p>
      
      <div class="result-card">
        <h2>Welcome to Show Page</h2>
        <p>This page will display your BMR calculation results.</p>
      </div>

      <div class="actions">
        <button class="btn back" @click="$emit('back')">Back to Form</button>
      </div>
    </div>
  </div>
</template>




<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ShowComponent',
  props: {
    employeeData: Object
  }
});
</script>

<style scoped>
.show-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 40px;
}

.show-content {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.show-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

.show-description {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.result-card {
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  border: 1px solid #e0e0e0;
}

.result-card h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 15px;
}

.result-card p {
  color: #666;
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: center;
}

.btn.back {
  padding: 14px 32px;
  background-color: #333;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.btn.back:hover {
  background-color: #555;
}

.btn.back:active {
  transform: scale(0.98);
}
</style>
