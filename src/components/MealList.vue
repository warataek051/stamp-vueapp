<template>
  <div class="meal-list-container">
    <div v-for="(meal, mealName) in meals" :key="mealName" class="meal-section">
      <div class="meal-header">
        <h3 class="meal-title">{{ mealName }}</h3>
        <span class="meal-calories">Total: {{ meal.totalCalories.toFixed(0) }} kcal</span>
      </div>
      <div class="food-grid">
        <div 
          v-for="(food, index) in meal.foods" 
          :key="food.name" 
          class="food-card" 
          :style="{ 'transition-delay': `${index * 100}ms` }"
        >
          <img :src="food.image" :alt="food.name" class="food-image">
          <div class="food-info">
            <h4 class="food-name">{{ food.name }}</h4>
            <p class="food-calories">{{ food.calories }} kcal</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Food } from './mockdata.vue';

// Defnie Type สำหรับ Prop ให้ชัดเจน
interface MealData {
  foods: Food[];
  totalCalories: number;
}

export default defineComponent({
  name: 'MealList',
  props: {
    meals: {
      // รับ Object ของมื้ออาหารเข้ามา
      type: Object as PropType<Record<string, MealData>>,
      required: true
    }
  }
});
</script>

<style scoped>
/* ย้าย CSS ที่เกี่ยวกับ Card และ Grid มาไว้ที่นี่ */
.meal-section {
  margin-bottom: 40px;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.meal-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.meal-calories {
  font-size: 0.9rem;
  color: #555;
}

.food-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 28px;
  padding: 10px 0;
}

.food-card {
  background-color: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  
  /* Animation setup */
  opacity: 0;
  transform: translateY(15px);
  animation: slideIn 0.5s ease-out forwards;
}

/* เพิ่ม keyframes เพื่อให้ animation ทำงานภายใน child component ได้ง่ายขึ้น */
@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.food-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.food-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-bottom: 1px solid #f0f0f0;
}

.food-info {
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.food-name {
  font-size: 1.05rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.food-calories {
  font-size: 0.9rem;
  color: #10b981;
  font-weight: 500;
  margin-top: 2px;
}
</style>