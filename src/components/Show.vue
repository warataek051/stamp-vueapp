<template>
  <div class="show-container">
    <div class="show-content" :class="{ 'visible': isVisible }">
      <h1 class="show-title">Calculation Results</h1>
      <p class="show-description">นี่คือผลลัพธ์การคำนวณและเมนูอาหารที่แนะนำสำหรับคุณ</p>
      <MealList :tdee="tdee" />
      <div class="actions-top">
        <button class="btn back" @click="handleBack">Back to Form</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick } from 'vue';
import MealList from './MealList.vue';
export default defineComponent({
  name: 'ShowComponent',
  components: {
    MealList },
  props: {
    bmr: { type: Number, required: true },
    tdee: { type: Number, required: true }},
  data() {
    return {
      animatedBmr: 0,
      animatedTdee: 0,
      isVisible: false,
    };
  },
  mounted() {
    nextTick(() => {
      this.isVisible = true;
      this.animateNumbers();
    });
  },
  methods: {
    handleBack() {
      this.isVisible = false;
      setTimeout(() => this.$emit('back'), 500);
    },
    animateNumbers() {
      this.tween(this, 'animatedBmr', this.bmr, 1000);
      this.tween(this, 'animatedTdee', this.tdee, 1200);
    },
    tween(target: any, key: string, endValue: number, duration: number) {
       const startValue = target[key];
       const startTime = performance.now();
       const animate = (currentTime: number) => {
         const elapsedTime = currentTime - startTime;
         if (elapsedTime < duration) {
           const progress = elapsedTime / duration;
           target[key] = startValue + (endValue - startValue) * progress;
           requestAnimationFrame(animate);
         } else {
           target[key] = endValue;
         }
       };
       requestAnimationFrame(animate);
    }
  },
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.show-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
}
.show-content {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 30px 40px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.show-content.visible {
  opacity: 1;
  transform: translateY(0);
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
  margin-bottom: 40px;
}
.actions-top {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  margin-top: 30px;
}
.btn.back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: #2c3e50;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}
.btn.back:hover {
  background-color: #34495e;
}
.btn.back:active {
  transform: scale(0.98);
}
</style>